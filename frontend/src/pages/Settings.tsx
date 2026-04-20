import { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { toast } from "react-toastify";
import { User, Shield, Bell } from "lucide-react";

type SettingsTab = "profile" | "security" | "notifications";

export default function Settings() {
  const user = useAppSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // profile form (UI only for now)
  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
  });

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.success("Profile settings updated (UI only)");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your account and preferences
        </p>
      </div>

      {/* ================= LAYOUT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* ================= SIDEBAR TABS ================= */}
        <div className="md:col-span-1 space-y-2">

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition
              ${activeTab === "profile"
                ? "bg-primary-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-600 dark:text-gray-300"
              }`}
          >
            <User size={18} /> Profile
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition
              ${activeTab === "security"
                ? "bg-primary-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-600 dark:text-gray-300"
              }`}
          >
            <Shield size={18} /> Security
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition
              ${activeTab === "notifications"
                ? "bg-primary-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-600 dark:text-gray-300"
              }`}
          >
            <Bell size={18} /> Notifications
          </button>

        </div>

        {/* ================= CONTENT ================= */}
        <div className="md:col-span-3">

          {/* ================= PROFILE ================= */}
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl p-6">

              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Profile Information
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-4">

                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    className="w-full mt-1 p-3 rounded-lg border bg-white dark:bg-dark-bg"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full mt-1 p-3 rounded-lg border bg-white dark:bg-dark-bg"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Save Changes
                </button>

              </form>

            </div>
          )}

          {/* ================= SECURITY ================= */}
          {activeTab === "security" && (
            <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl p-6">

              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Security
              </h2>

              <div className="space-y-4">

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-gray-500">
                    Update your password for better security
                  </p>

                  <button
                    onClick={() => toast.info("Password change feature coming soon")}
                    className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg"
                  >
                    Change Password
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ================= NOTIFICATIONS ================= */}
          {activeTab === "notifications" && (
            <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl p-6">

              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Notifications
              </h2>

              <div className="space-y-3">

                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary-500" />
                  Email notifications
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary-500" />
                  Field updates alerts
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary-500" />
                  System announcements
                </label>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}