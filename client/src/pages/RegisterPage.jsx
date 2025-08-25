import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/errorHelper";
import { Register } from "../api/auth";
import { FaSpinner } from "react-icons/fa";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isloading, setIsLoading] = useState(false);
  const { isAuthenticated, loading } = useAuth();

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
      const response = await Register(userData);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      toast.success(response.message);
      navigate("/login");
    } catch (error) {
      if (Array.isArray(error?.errors)) {
        setError(error.errors);
      } else {
        const message = extractErrorMessage(error);
        toast.error(message);
      }
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
            onChange={(e) => {
              setUsername(e.target.value);
              setError((prev) =>
                prev ? prev.filter((item) => item.path !== "username") : null,
              );
            }}
            autoComplete="username"
          />
          {Array.isArray(error) &&
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
            placeholder="กรอกอีเมลของคุณ"
            className="mt-2 w-full rounded border border-gray-300 p-2"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError((prev) =>
                prev ? prev.filter((item) => item.path !== "email") : null,
              );
            }}
            autoComplete="email"
          />
          {error
            ?.filter((item) => item.path === "email")
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
            placeholder="กรอกรหัสผ่านของคุณ"
            className="mt-2 w-full rounded border border-gray-300 p-2"
            required
            minLength={3}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="password"
          />
          {error
            ?.filter((item) => item.path === "password")
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
            placeholder="ยืนยันรหัสผ่านของคุณ"
            className="mt-2 w-full rounded border border-gray-300 p-2"
            required
            minLength={3}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
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
              <div className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin text-white" />
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
