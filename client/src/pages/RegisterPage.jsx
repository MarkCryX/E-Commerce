import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/errorHelper";
const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isloading, setIsLoading] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("password ไม่ตรงกัน");
      return;
    }
    const userData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      setIsLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 10000));
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/register`,
        userData,
      );

      if (response.status !== 201) {
        toast.error("สมัครสมาชิกไม่สำเร็จ");
      }

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      toast.success("สมัครสมาชิกสำเร็จ");
      navigate("/login");
    } catch (error) {
      const message = extractErrorMessage(error);
      console.error("เกิดข้อผิดพลาดระหว่างการสมัครสมาชิก", error);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="mt-20 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="mb-4 rounded-2xl bg-white p-10 py-20 shadow-md"
      >
        <h1 className="text-center text-2xl font-semibold">สมัครสมาชิก</h1>
        <div className="mx-auto mt-6 max-w-md">
          <label htmlFor="username">username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="ชื่อผู้ใช้ต้องมี 3-30 ตัวอักษร"
            className="mt-2 w-full rounded border border-gray-300 p-2"
            required
            value={username}
            maxLength={30}
            minLength={3}
            onChange={(e) => setUsername(e.target.value)}
            // autocomplete="username"
          />
          {error &&
            error
              .filter((item) => item.path === "username")
              .map((item, index) => (
                <p key={index} className="text-sm text-red-500">
                  *{item.msg}
                </p>
              ))}
        </div>
        <div className="mx-auto mt-6 max-w-md">
          <label htmlFor="email">email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="mt-2 w-full rounded border border-gray-300 p-2"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError((prev) =>
                prev ? prev.filter((item) => item.path !== "email") : null,
              );
            }}
            // autoComplete="email"
          />
          {error &&
            error
              .filter((item) => item.path === "email")
              .map((item, index) => (
                <p key={index} className="text-sm text-red-500">
                  *{item.msg}
                </p>
              ))}
        </div>
        <div className="mx-auto mt-6 max-w-md">
          <label htmlFor="password">
            password{" "}
            <span className="text-[11px] text-gray-500">
              *รหัสผ่านต้องมีอย่างน้อย 8 ตัว, มีตัวพิมพ์เล็ก, ตัวพิมพ์ใหญ่,
              ตัวเลข, และสัญลักษณ์
            </span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="mt-2 w-full rounded border border-gray-300 p-2"
            required
            minLength={3}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // autoComplete="password"
          />
          {error &&
            error
              .filter((item) => item.path === "password")
              .map((item, index) => (
                <p key={index} className="text-sm text-red-500">
                  *{item.msg}
                </p>
              ))}
        </div>
        <div className="mx-auto mt-6 max-w-md">
          <label htmlFor="confirmPassword">confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            className="mt-2 w-full rounded border border-gray-300 p-2"
            required
            minLength={3}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            // autoComplete="new-password"
          />
          {password !== confirmPassword && confirmPassword !== "" && (
            <p className="text-sm text-red-500">*password ไม่ตรงกัน</p>
          )}
        </div>
        <div className="mx-auto mt-6 max-w-md text-center">
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-green-400 p-2.5 text-center hover:bg-green-500 disabled:bg-gray-500"
            disabled={isloading}
          >
            {isloading ? (
              <div className="flex gap-2">
                <svg
                  className="mx-auto h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>กำลังสมัครสมาชิก</span>
              </div>
            ) : (
              "สมัครสมาชิก"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default RegisterPage;
