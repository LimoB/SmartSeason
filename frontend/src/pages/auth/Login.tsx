import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApi";
import { useAppDispatch } from "../../app/hooks";
import { setCredentials } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login(form).unwrap();

      // ================= SAVE AUTH =================
      dispatch(
        setCredentials({
          user: res.user,
          token: res.token,
        })
      );

      localStorage.setItem("token", res.token);

      toast.success(`Welcome back, ${res.user.fullName}`);

      // ================= ROLE REDIRECT =================
      setTimeout(() => {
        if (res.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/agent/dashboard");
        }
      }, 800);

    } catch (err) {
      let message = "Login failed. Please try again.";

      if (typeof err === "object" && err !== null) {
        const e = err as {
          data?: { error?: string };
          error?: string;
        };

        message = e.data?.error || e.error || message;
      }

      console.error("Login failed:", err);
      toast.error(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-light-card dark:bg-dark-surface p-6 rounded-2xl border border-light-border dark:border-dark-border shadow-md transition">

      {/* ================= TITLE ================= */}
      <h2 className="text-2xl font-bold text-center mb-6 text-primary-500">
        Login
      </h2>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-transparent border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-transparent border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* ================= BUTTON ================= */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* ================= LINKS ================= */}
      <p className="text-center text-sm text-light-muted dark:text-dark-muted mt-4">
        Don’t have an account?{" "}
        <Link to="/register" className="text-primary-500 hover:underline">
          Register
        </Link>
      </p>

      <div className="text-center mt-3">
        <Link
          to="/"
          className="text-sm text-light-muted dark:text-dark-muted hover:text-primary-500"
        >
          ← Back to Home
        </Link>
      </div>

    </div>
  );
}