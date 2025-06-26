// context/AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // ยังคงใช้ axios ตัวเดิม
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // *** 1. ตั้งค่า Axios Interceptor ใน AuthProvider เมื่อ Component นี้ถูก Mount ***
    useEffect(() => {
        // ตัวแปรนี้ใช้ป้องกันการวนลูปไม่รู้จบหาก refresh token ก็มีปัญหา
        let isRefreshing = false;
        let failedQueue = [];

        const processQueue = (error, token = null) => {
            failedQueue.forEach(prom => {
                if (error) {
                    prom.reject(error);
                } else {
                    prom.resolve(token);
                }
            });
            failedQueue = [];
        };

        const interceptor = axios.interceptors.response.use(
            (response) => response, // ถ้า response สำเร็จ ให้ผ่านไป
            async (error) => {
                const originalRequest = error.config;

                // ตรวจสอบว่าเป็น Error 401 และไม่ได้กำลังพยายาม refresh token อยู่แล้ว
                // และไม่ใช่ request ที่ถูกเรียกสำหรับ refresh token โดยตรง
                if (error.response?.status === 401 && !originalRequest._retry) {
                    // กำหนด originalRequest._retry เพื่อป้องกันการวนซ้ำสำหรับ request นี้
                    originalRequest._retry = true;

                    // ถ้ายังไม่มีการ refresh token กำลังดำเนินการ
                    if (!isRefreshing) {
                        isRefreshing = true; // ตั้งค่าว่ากำลัง refresh token
                        try {
                            // เรียก API เพื่อขอ Access Token ใหม่โดยใช้ Refresh Token
                            const refreshResponse = await axios.post(
                                `${import.meta.env.VITE_BACK_END_URL}/api/auth/refresh_token`,
                                {}, // ส่ง body ว่างเปล่า หรือตามที่ Backend ต้องการ
                                { withCredentials: true } // สำคัญ: ต้องส่ง cookie ไปด้วย
                            );

                            if (refreshResponse.status === 200) {
                                // ถ้าได้ Access Token ใหม่มาสำเร็จ
                                isRefreshing = false;
                                processQueue(null); // เคลียร์ queue และส่ง request ที่ค้างอยู่ซ้ำ
                                // ไม่ต้องตั้งค่า cookie ใน frontend เพราะ server ตั้งให้แล้ว
                                return axios(originalRequest); // ส่ง request เดิมซ้ำด้วย Access Token ใหม่
                            }
                        } catch (refreshError) {
                            console.error("Refresh token failed:", refreshError);
                            isRefreshing = false;
                            processQueue(new Error("Refresh token failed")); // แจ้ง error ให้ request ที่ค้างอยู่
                            // ถ้า Refresh Token หมดอายุหรือไม่ถูกต้อง ให้ Logout ผู้ใช้
                            setIsAuthenticated(false);
                            setUser(null);
                            // ลบคุกกี้จาก client ด้วย (แม้ว่า server จะลบแล้วก็ตาม)
                            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            toast.error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง");
                            // คุณอาจต้องการ redirect ไปหน้า login ที่นี่ (ถ้ามี navigate)
                            // navigate('/login');
                        }
                    }
                    // ถ้ามีการ refresh token กำลังดำเนินการอยู่แล้ว
                    // ให้เพิ่ม request ปัจจุบันเข้าคิวรอ Access Token ใหม่
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(() => axios(originalRequest)); // เมื่อได้ token ใหม่แล้ว ให้ retry request เดิม
                }
                return Promise.reject(error); // ส่ง error ต่อไปหากไม่สามารถจัดการได้
            }
        );

        // Cleanup function: ลบ interceptor เมื่อ component ถูก unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []); // ให้ useEffect ทำงานแค่ครั้งเดียวเมื่อ component mount

    // ฟังก์ชันสำหรับตรวจสอบสถานะการล็อกอินเมื่อ Component โหลด
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/api/auth/status`, {
                withCredentials: true,
            });

            if (response.status === 200 && response.data.isAuthenticated) {
                setIsAuthenticated(true);
                setUser(response.data.user);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setIsAuthenticated(false);
                setUser(null);
            } else {
                console.error("Failed to check authentication status:", error);
                setIsAuthenticated(false);
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    // ฟังก์ชันสำหรับ login
    const login = async (email, password) => {
        setLoading(true)
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACK_END_URL}/api/login`,
                { email, password },
                { withCredentials: true }
            );
            

            
            if (response.status === 200 && response.data.user) {
                setIsAuthenticated(true);
                setUser(response.data.user);
                setLoading(false);
                return { success: true, message: response.data.message, user: response.data.user };
            }

        } catch (error) {
            console.error("Login failed:", error);
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
            return {
                success: false,
                message: error.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
            };
        }
    };

    // ฟังก์ชันสำหรับ logout
    const logout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACK_END_URL}/api/logout`, {}, { withCredentials: true });
            setIsAuthenticated(false);
            setUser(null);
            toast.success("ออกจากระบบสำเร็จ");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};