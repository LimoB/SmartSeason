import { useState } from "react";
import { useGetMeQuery } from "@/features/auth/authApi";
import { toast } from "react-toastify";

type EditableUser = {
  fullName: string;
  email: string;
};

export default function Profile() {
  const { data: user, isLoading, error, refetch } = useGetMeQuery();

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<EditableUser>({
    fullName: "",
    email: "",
  });

  /* ================= ENTER EDIT MODE ================= */
  const handleStartEdit = () => {
    if (user) {
      setForm({
        fullName: user.fullName,
        email: user.email,
      });
    }
    setIsEditing(true);
  };

  /* ================= SAVE ================= */
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // TODO: connect real update API later

      toast.success("Profile updated successfully");
      setIsEditing(false);
      refetch();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        <div className="h-6 w-40 bg-gray-200 dark:bg-dark-surface animate-pulse rounded" />
        <div className="h-10 bg-gray-200 dark:bg-dark-surface rounded" />
        <div className="h-10 bg-gray-200 dark:bg-dark-surface rounded" />
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Profile
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your account information
          </p>
        </div>

        <button
          onClick={() => (isEditing ? setIsEditing(false) : handleStartEdit())}
          className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>

      </div>

      {/* ================= CARD ================= */}
      <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl p-6 shadow-sm">

        {!isEditing ? (
          /* ================= VIEW MODE ================= */
          <div className="space-y-4">

            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-lg font-medium text-gray-800 dark:text-white">
                {user?.fullName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-gray-800 dark:text-white">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Role</p>
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-primary-500 text-white">
                {user?.role}
              </span>
            </div>

          </div>
        ) : (
          /* ================= EDIT MODE ================= */
          <form onSubmit={handleSave} className="space-y-4">

            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <input
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="w-full mt-1 p-3 rounded-lg border bg-white dark:bg-dark-bg"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full mt-1 p-3 rounded-lg border bg-white dark:bg-dark-bg"
              />
            </div>

            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Save Changes
              </button>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}