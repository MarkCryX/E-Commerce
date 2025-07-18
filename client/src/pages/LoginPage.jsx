import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await login(email, password);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("ล็อกอินล้มเหลว", error);
    } finally {
      setLocalLoading(false);
    }
  };

  // if (loading) {
  //   return <div className="mt-10 text-center">กำลังตรวจสอบสถานะ...</div>; // หรือ spinner
  // }

  return (
    <div className="flex justify-center mt-30">
      <form
        onSubmit={handleSubmit}
        className="mb-4 rounded-2xl bg-white py-20 shadow-md p-10"
      >
        <h1 className="text-center text-2xl font-semibold">ล็อกอิน</h1>
        <div className="mx-auto mt-6 max-w-md">
          <label>email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="mt-2 w-full rounded border border-gray-300 p-2"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mx-auto mt-6 max-w-md">
          <label>password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="mt-2 w-full rounded border border-gray-300 p-2"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mx-auto mt-6 max-w-md text-center">
          <div className="mx-auto mt-6 max-w-md text-center">
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-blue-400 p-2.5 text-center hover:bg-blue-500 disabled:opacity-50"
              disabled={localLoading} // ปิดปุ่มตอนโหลด
            >
              {localLoading ? (
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
              ) : (
                "ล็อกอิน"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};


export default LoginPage;
