import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../features/auth/authApi";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(form).unwrap();

      toast.success("Account created successfully!");

      // small delay for UX
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      let message = "Registration failed. Please try again.";

      if (typeof err === "object" && err !== null) {
        const e = err as {
          data?: { error?: string };
          error?: string;
        };

        message = e.data?.error || e.error || message;
      }

      toast.error(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-light-card dark:bg-dark-surface p-6 rounded-2xl border border-light-border dark:border-dark-border shadow-md transition">

      {/* ================= TITLE ================= */}
      <h2 className="text-2xl font-bold text-center mb-6 text-primary-500">
        Create Account
      </h2>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="fullName"
          placeholder="Full Name"
          className="w-full p-3 rounded-lg bg-transparent border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={form.fullName}
          onChange={handleChange}
          required
        />

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
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>

      {/* ================= LOGIN LINK ================= */}
      <p className="text-center text-sm text-light-muted dark:text-dark-muted mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-primary-500 hover:underline">
          Login
        </Link>
      </p>

      {/* ================= BACK HOME ================= */}
      <div className="text-center mt-3">
        <Link
          to="/"
          className="text-sm text-light-muted dark:text-dark-muted hover:text-primary-500 transition"
        >
          ← Back to Home
        </Link>
      </div>

    </div>
  );
}