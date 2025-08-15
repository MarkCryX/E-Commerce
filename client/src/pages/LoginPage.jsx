import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/errorHelper";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 50000));
      const response = await login(email, password);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="mt-30 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="mb-4 rounded-2xl bg-white p-10 py-20 shadow-md"
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
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span>Loading...</span>
                </div>
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
