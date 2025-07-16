// context/AuthContext.js
import { createContext, useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [hasRefreshTokenFailed, setHasRefreshTokenFailed] = useState(false);

  const interceptorInitialized = useRef(false);
  const isInitialMount = useRef(true);
  const isRefreshingRef = useRef(false);
  const isCheckingAuthRef = useRef(false);

  // ฟังก์ชันจัดการเมื่อ authentication ล้มเหลว
  const handleAuthFailure = (error = null) => {
    console.error("Authentication failed:", error);

    // 2. ตั้งค่าสถานะการยืนยันตัวตนให้เป็น false และล้างข้อมูลผู้ใช้
    setIsAuthenticated(false);
    setUser(null);
    setHasRefreshTokenFailed(true);
    setLoading(false);

    // 3. หน่วงเวลาเล็กน้อยแล้วเปลี่ยนเส้นทางไปหน้า /login
    setTimeout(() => {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }, 300);
  };

  //ฟังก์ชัน refreshToken
  const refreshToken = async () => {
    // 1. ตรวจสอบสถานะเพื่อป้องกันการเรียกซ้ำ
    if (isRefreshingRef.current || hasLoggedOut) return false;

    // 2. ตั้งค่าสถานะว่ากำลัง refresh token
    isRefreshingRef.current = true;

    try {
      // 3. ส่งคำขอไปยัง Backend เพื่อ refresh token
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/auth/refresh_token`,
        {},
        { withCredentials: true },
      );

      // 4. ตรวจสอบการตอบกลับ
      if (response.status === 200 && response.data.isAuthenticated) {
        return true; // refresh สำเร็จ
      }

      return false; // refresh ไม่สำเร็จ
    } catch (error) {
      // 5. จัดการข้อผิดพลาดในการ refresh token
      console.error("Refresh token failed:", error);
      handleAuthFailure(error);
      return false;
    } finally {
      // 6. ตั้งค่าสถานะว่าหยุด refresh แล้ว
      isRefreshingRef.current = false;
    }
  };

  // ฟังก์ชันสำหรับตรวจสอบสถานะการล็อกอิน
  const checkAuthStatus = async () => {
    // 1. ตรวจสอบสถานะเพื่อป้องกันการเรียกซ้ำ
    if (isCheckingAuthRef.current || hasLoggedOut) return null;

    // 2. ตั้งค่าสถานะว่ากำลังตรวจสอบสิทธิ์
    isCheckingAuthRef.current = true;

    try {
      // 3. ส่งคำขอไปยัง Backend เพื่อตรวจสอบสถานะการล็อกอิน
      const response = await axios.get(
        `${import.meta.env.VITE_BACK_END_URL}/api/auth/status`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // 4. ตรวจสอบการตอบกลับ
      if (response.data?.isAuthenticated && response.data?.user) {
        // 4.1. ถ้ายืนยันตัวตนสำเร็จ
        setIsAuthenticated(true);
        setUser(response.data.user);
        setHasRefreshTokenFailed(false);
      } else {
        // 4.2. ถ้าไม่สำเร็จ
        handleAuthFailure();
      }
    } catch (error) {
      // 5. จัดการข้อผิดพลาดในการตรวจสอบสถานะ
      console.error("Auth status check failed:", error);

      // 5.1. ถ้าได้รับสถานะ 401 (Unauthorized)
      if (error.response?.status === 401) {
        const refreshSuccess = await refreshToken();

        if (refreshSuccess) {
          // 5.1.1. ถ้า refresh สำเร็จ ลองตรวจสอบสถานะอีกครั้ง
          try {
            const retryResponse = await axios.get(
              `${import.meta.env.VITE_BACK_END_URL}/api/auth/status`,
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );

            if (
              retryResponse.data?.isAuthenticated &&
              retryResponse.data?.user
            ) {
              setIsAuthenticated(true);
              setUser(retryResponse.data.user);
              setHasRefreshTokenFailed(false);
            } else {
              handleAuthFailure();
            }
          } catch (retryError) {
            handleAuthFailure(retryError); // ถ้าลองซ้ำแล้วยังล้มเหลว
          }
        } else {
          handleAuthFailure(error); // ถ้า refresh ล้มเหลว
        }
      } else {
        handleAuthFailure(error); // ข้อผิดพลาดอื่นๆ
      }
    } finally {
      // 6. ตั้งค่าสถานะว่าหยุดตรวจสอบสิทธิ์แล้ว และหยุดโหลด
      isCheckingAuthRef.current = false;
      setLoading(false);
    }
  };

  // Setup Interceptor
  useEffect(() => {
    // 1. ตรวจสอบว่า interceptor ได้รับการเริ่มต้นแล้วหรือไม่
    if (interceptorInitialized.current) return;
    interceptorInitialized.current = true;

    // 2. เพิ่ม Interceptor สำหรับ Response
    const interceptor = axios.interceptors.response.use(
      (response) => response, // ถ้า Response สำเร็จ ให้ส่ง Response ต่อไป
      async (error) => {
        const originalRequest = error.config; // เก็บ Request เดิม

        // 3. ถ้าได้รับสถานะ 401 และ Request เดิมยังไม่เคยถูก Retry มาก่อน
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // ตั้งค่าว่า Request นี้ได้ถูก Retry แล้ว

          const refreshSuccess = await refreshToken(); // พยายาม refresh token

          // ถ้า refresh สำเร็จ ให้ retry Request เดิม
          if (refreshSuccess) {
            return axios(originalRequest);
          }
        }
        return Promise.reject(error); // ถ้าไม่ใช่ 401 หรือ refresh ไม่สำเร็จ ให้ส่ง Error ต่อไป
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptor); // 4. Cleanup Function: ลบ Interceptor เมื่อ Component ถูก Unmount
    };
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      if (isInitialMount.current) {
        // 1. ตรวจสอบว่าเป็น Mount ครั้งแรกหรือไม่
        isInitialMount.current = false;
        // 2. เรียกฟังก์ชัน checkAuthStatus ทันที

        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACK_END_URL}/api/auth/has_token`,
            { withCredentials: true },
          );

          const { hasRefreshToken, hasAccessToken } = response.data;

          if (hasRefreshToken || hasAccessToken) {
            await checkAuthStatus();
          } else {
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
          }
        } catch (error) {
          console.error("❌ Failed to check token existence:", err);
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  // ฟังก์ชันสำหรับ login
  const login = async (email, password) => {
    setLoading(true);

    try {
      // 1. ส่งคำขอ Login ไปยัง Backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/login`,
        { email, password },
        { withCredentials: true }, // ส่ง cookie ไปด้วย
      );

      // 2. ตรวจสอบการตอบกลับ
      if (response.status === 200 && response.data.user) {
        // 2.1. ถ้า Login สำเร็จ
        setIsAuthenticated(true);
        setUser(response.data.user);
        setHasRefreshTokenFailed(false);
        setHasLoggedOut(false);
        setLoading(false);

        return {
          success: true,
          message: response.data.message,
          user: response.data.user,
        };
      }
    } catch (error) {
      // 3. จัดการข้อผิดพลาดในการ Login
      console.error("❌ Login failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return {
        success: false,
        message:
          error.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      };
    }
  };

  // ฟังก์ชันสำหรับ logout
  const logout = async () => {
    try {
      // 1. ตั้งค่าสถานะต่างๆ ที่เกี่ยวข้องกับการ logout
      setHasLoggedOut(true);
      setHasRefreshTokenFailed(true);
      setIsAuthenticated(false);
      setUser(null);

      // 2. รีเซ็ต ref ต่างๆ
      isRefreshingRef.current = false;
      isCheckingAuthRef.current = false;

      // 3. ส่งคำขอ Logout ไปยัง Backend
      await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/logout`,
        {},
        { withCredentials: true },
      );

      // 4. ลบ Cookies ทั้งหมดที่เกี่ยวข้องกับ Domain ปัจจุบัน
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === " ") {
          cookie = cookie.substring(1);
        }
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie =
          name +
          "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" +
          window.location.hostname;
        document.cookie =
          name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
      }

      // 5. ทำความสะอาด Storage ต่างๆ (sessionStorage, indexedDB, cache)
      sessionStorage.clear();
      if (indexedDB) {
        indexedDB.databases().then((dbs) => {
          dbs.forEach((db) => indexedDB.deleteDatabase(db.name));
        });
      }

      if ("caches" in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => caches.delete(cacheName));
        });
      }

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => registration.unregister());
        });
      }

      // 6. เปลี่ยน URL ไปยัง /login และโหลดหน้าใหม่
      window.history.replaceState(null, "", "/login");
      setTimeout(() => {
        window.location.replace("/login");
      }, 100);

      return { success: true, message: "ออกจากระบบสำเร็จ" };
    } catch (error) {
      // 7. จัดการข้อผิดพลาดในการ Logout
      console.error("❌ Logout failed:", error);
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        setLoading,
        login,
        logout,
        checkAuthStatus,
        refreshToken,
        hasLoggedOut,
        hasRefreshTokenFailed,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
