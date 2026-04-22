import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { 
  UserPlus, 
  Search, 
  Mail, 
  ShieldCheck, 
  Trash2, 
  UserCog, 
  AlertCircle 
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useGetUsersQuery, useDeleteUserMutation } from "@/features/users/userApi";
import { setSearch, setRoleFilter } from "@/features/users/userSlice";
import type { User } from "@/types/types";
import type { RoleFilter } from "@/features/users/userSlice";

export default function Users() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // State from Slice
  const { search, roleFilter } = useAppSelector((state) => state.users);

  // API Hooks
  const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((u: User) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesSearch = 
        u.fullName.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      await deleteUser(id);
    }
  };

  if (isLoading) return <UsersSkeleton />;

  if (isError) return (
    <div className="text-center py-20 bg-white dark:bg-dark-bg rounded-3xl border-2 border-dashed border-red-200 dark:border-dark-border">
      <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Failed to load users</h3>
      <button onClick={() => refetch()} className="mt-4 text-primary-500 font-bold underline">Try Again</button>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Control system access and assign roles</p>
        </div>
        <button
          onClick={() => navigate("/admin/users/create")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:opacity-90 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-95 font-bold"
        >
          <UserPlus size={20} />
          Create User
        </button>
      </header>

      {/* SEARCH & FILTERS */}
      <section className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-dark-bg p-4 rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-surface/50 border border-transparent focus:border-primary-500 rounded-xl outline-none transition-all text-sm"
          />
        </div>
        <div className="flex bg-gray-100 dark:bg-dark-surface p-1 rounded-xl">
          {(["all", "admin", "field_agent"] as RoleFilter[]).map((role) => (
            <button
              key={role}
              onClick={() => dispatch(setRoleFilter(role))}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-tighter transition-all ${
                roleFilter === role
                  ? "bg-white dark:bg-gray-700 shadow-sm text-primary-500"
                  : "text-gray-500"
              }`}
            >
              {role.replace("_", " ")}
            </button>
          ))}
        </div>
      </section>

      {/* USER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((u: User) => (
          <div key={u.id} className="group bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-3xl p-6 hover:shadow-md transition-all relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="h-14 w-14 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-xl border border-primary-500/20">
                {u.fullName.charAt(0)}
              </div>
              <RoleBadge role={u.role} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{u.fullName}</h3>
            
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Mail size={14} className="text-primary-500" />
                <span className="truncate">{u.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <ShieldCheck size={14} className="text-primary-500" />
                <span className="capitalize">{u.role.replace("_", " ")}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-border">
              <button 
                onClick={() => navigate(`/admin/users/edit/${u.id}`)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary-500 transition-colors"
              >
                <UserCog size={16} />
                EDIT
              </button>
              <button 
                onClick={() => handleDelete(u.id)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "admin";
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
      isAdmin 
        ? "bg-primary-500 text-white border-primary-600 shadow-sm" 
        : "bg-gray-100 dark:bg-dark-surface text-gray-500 border-gray-200 dark:border-dark-border"
    }`}>
      {role}
    </span>
  );
}

const UsersSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-10 w-48 bg-gray-200 dark:bg-dark-surface rounded-xl" />
      <div className="h-12 w-32 bg-gray-200 dark:bg-dark-surface rounded-xl" />
    </div>
    <div className="h-16 w-full bg-gray-200 dark:bg-dark-surface rounded-2xl" />
    <div className="grid grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-56 bg-gray-200 dark:bg-dark-surface rounded-3xl" />)}
    </div>
  </div>
);