import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, User as UserIcon, Lock, Mail, Shield, Loader2 } from "lucide-react";
import { 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useGetUserByIdQuery 
} from "../../features/users/userApi";
// Import your types here
// Import your types here
import type { User, UserRole } from "../../types/types"; 

// We define exactly what the form needs. 
// Password is required for creation, optional for editing.
interface FormState {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

function UserFormInner({ existingUser, isEdit }: { existingUser?: User, isEdit: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormState>({
    fullName: existingUser?.fullName || "",
    email: existingUser?.email || "",
    password: "",
    role: existingUser?.role || "field_agent",
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        // We create a copy of the state to manipulate
        const payload: Partial<FormState> & { id: number } = { 
          id: Number(id),
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role
        };

        // Only include password in update if the user actually typed one
        if (formData.password.trim() !== "") {
          payload.password = formData.password;
        }

        await updateUser(payload).unwrap();
      } else {
        await createUser(formData).unwrap();
      }
      navigate("/admin/users");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error saving user. Please check your data.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors font-bold text-sm"
      >
        <ChevronLeft size={20} />
        BACK TO LIST
      </button>

      <div className="bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-3xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface/30">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {isEdit ? "Edit System User" : "Create New User"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit ? `Modifying profile for ${existingUser?.fullName}` : "Fill in the details to manage system access."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            {/* FULL NAME */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-surface rounded-xl border border-transparent focus:border-primary-500 focus:bg-white outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-surface rounded-xl border border-transparent focus:border-primary-500 focus:bg-white outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {isEdit ? "New Password (Leave blank to keep current)" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required={!isEdit}
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-surface rounded-xl border border-transparent focus:border-primary-500 focus:bg-white outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* ROLE */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">User Role</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'field_agent'})}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                    formData.role === 'field_agent' 
                    ? "border-primary-500 bg-primary-500/5 text-primary-500" 
                    : "border-gray-100 dark:border-dark-border text-gray-400 grayscale"
                  }`}
                >
                  <UserIcon size={24} />
                  <span className="text-xs font-bold uppercase">Field Agent</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'admin'})}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                    formData.role === 'admin' 
                    ? "border-primary-500 bg-primary-500/5 text-primary-500" 
                    : "border-gray-100 dark:border-dark-border text-gray-400 grayscale"
                  }`}
                >
                  <Shield size={24} />
                  <span className="text-xs font-bold uppercase">Administrator</span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="w-full py-4 bg-primary-500 text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 shadow-xl shadow-primary-500/30 transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {(isCreating || isUpdating) && <Loader2 className="animate-spin" size={20} />}
            {isCreating || isUpdating ? "Saving..." : isEdit ? "Update User" : "Create User Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const { data: existingUser, isLoading, isError } = useGetUserByIdQuery(Number(id), { 
    skip: !isEdit,
    refetchOnMountOrArgChange: true 
  });

  if (isEdit && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="animate-spin text-primary-500" size={48} />
        <p className="text-gray-500 font-bold animate-pulse">Fetching user details...</p>
      </div>
    );
  }

  if (isEdit && isError) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200">
        <p className="text-red-600 font-bold">User not found or error loading data.</p>
      </div>
    );
  }

  // Uses the user ID and fullName for the key to ensure the form re-initializes 
  // correctly when data loads or changes.
  const formKey = isEdit ? `edit-${id}-${existingUser?.fullName}` : "new-user";

  return <UserFormInner key={formKey} existingUser={existingUser} isEdit={isEdit} />;
}