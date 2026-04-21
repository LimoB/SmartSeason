import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Plus, Search, LayoutGrid, Table, UserPlus, Trash2, AlertCircle, User as UserIcon, Eye } from "lucide-react";

import { useGetFieldsQuery, useDeleteFieldMutation } from "@/features/fields/fieldApi";
import { useGetUsersQuery } from "@/features/users/userApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setFilter, setSearch, setViewMode } from "@/features/fields/fieldSlice";
import type { Field, FieldStatus, User } from "@/types/types";

export default function Fields() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isAdmin = currentUser?.role === "admin";

  const { data: fieldData, isLoading: fieldsLoading, isError: fieldsError } = useGetFieldsQuery();
  const { data: userData, isLoading: usersLoading } = useGetUsersQuery();

  const fields = useMemo(() => {
    const rawFields = (fieldData || []) as Field[];
    const allUsers = (userData || []) as User[];

    return rawFields.map(field => {
      const agent = allUsers.find(u => u.id === field.assignedAgentId);
      return {
        ...field,
        agent: agent ? { fullName: agent.fullName } : null
      };
    });
  }, [fieldData, userData]);

  const [deleteField] = useDeleteFieldMutation();
  const { filter, search, viewMode } = useAppSelector((state) => state.fields);

  const filteredFields = useMemo(() => {
    return fields.filter((f) => {
      const matchesFilter = filter === "all" || f.currentStage === filter;
      const matchesSearch = 
        f.name.toLowerCase().includes(search.toLowerCase()) || 
        f.cropType.toLowerCase().includes(search.toLowerCase()) ||
        f.agent?.fullName?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [fields, filter, search]);

  const handleDelete = async (id: number) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this field? This action cannot be undone.")) {
      try {
        await deleteField(id).unwrap();
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }
  };

  const getStatusStyles = (status: FieldStatus) => {
    switch (status) {
      case "at_risk": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200";
      case "completed": return "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400";
      default: return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    }
  };

  if (fieldsLoading || usersLoading) return <FieldsSkeleton />;
  if (fieldsError) return <div className="p-10 text-center text-red-500 font-medium">Error loading fields.</div>;

  return (
    <div className="space-y-6 p-4 md:p-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Fields</h1>
        {isAdmin && (
          <button
            onClick={() => navigate("/fields/create")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
          >
            <Plus size={20} />
            Add New Field
          </button>
        )}
      </header>

      {/* FILTER BAR */}
      <section className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full lg:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search fields, crops, or agents..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {(["all", "planted", "growing", "ready", "harvested"] as const).map((f) => (
              <button
                key={f}
                onClick={() => dispatch(setFilter(f))}
                className={`px-3 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${
                  filter === f ? "bg-white dark:bg-slate-700 text-green-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-1 border-l border-slate-200 dark:border-slate-700 ml-2 pl-2">
            <ViewButton active={viewMode === "grid"} onClick={() => dispatch(setViewMode("grid"))} icon={<LayoutGrid size={18} />} />
            <ViewButton active={viewMode === "table"} onClick={() => dispatch(setViewMode("table"))} icon={<Table size={18} />} />
          </div>
        </div>
      </section>

      {filteredFields.length === 0 ? (
        <EmptyState />
      ) : viewMode === "grid" ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFields.map((field) => (
            <FieldCard 
              key={field.id} 
              field={field} 
              isAdmin={isAdmin} 
              onDelete={handleDelete} 
              statusStyle={getStatusStyles(field.status)} 
            />
          ))}
        </div>
      ) : (
        <FieldTable fields={filteredFields} isAdmin={isAdmin} onDelete={handleDelete} />
      )}
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

interface SubComponentProps {
  field: Field & { agent?: { fullName: string } | null };
  isAdmin: boolean;
  onDelete: (id: number) => void;
  statusStyle: string;
}

function FieldCard({ field, isAdmin, onDelete, statusStyle }: SubComponentProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{field.name}</h3>
          <p className="text-sm text-slate-500 font-medium">{field.cropType}</p>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${statusStyle}`}>
          {field.status === 'at_risk' && <AlertCircle size={12} />}
          {field.status.replace('_', ' ')}
        </div>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
          <UserIcon size={14} className="text-slate-400" />
          <div className="text-xs">
            <span className="text-slate-400 block uppercase tracking-tighter font-bold">Assigned To</span>
            <span className="text-slate-700 dark:text-slate-200 font-bold">
              {field.agent?.fullName || "Unassigned"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => navigate(`/fields/${field.id}`)} 
            className="flex items-center gap-1.5 text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
          >
            <Eye size={16} />
            Details
          </button>
          
          <div className="flex gap-2">
            {isAdmin && (
              <>
                <button 
                  onClick={() => navigate(`/fields/${field.id}/assign`)} 
                  className="p-2 text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                  title="Assign Agent"
                >
                  <UserPlus size={18} />
                </button>
                <button 
                  onClick={() => onDelete(field.id)} 
                  className="p-2 text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                  title="Delete Field"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldTable({ fields, isAdmin, onDelete }: { fields: (Field & { agent?: { fullName: string } | null })[]; isAdmin: boolean; onDelete: (id: number) => void }) {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
          <tr>
            <th className="px-6 py-4">Field Name</th>
            <th className="px-6 py-4">Crop</th>
            <th className="px-6 py-4">Assigned To</th>
            <th className="px-6 py-4">Stage</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {fields.map((f) => (
            <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{f.name}</td>
              <td className="px-6 py-4 text-slate-500 font-medium">{f.cropType}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[10px] font-bold text-green-700 dark:text-green-400">
                    {f.agent?.fullName?.charAt(0) || "?"}
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-bold">{f.agent?.fullName || "Unassigned"}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-block px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 capitalize font-bold text-slate-600 dark:text-slate-400 text-[10px]">
                  {f.currentStage}
                </span>
              </td>
              {/* Actions are now permanently visible, no group-hover used */}
              <td className="px-6 py-4">
                <div className="flex justify-end items-center gap-2">
                  <button 
                    onClick={() => navigate(`/fields/${f.id}`)} 
                    className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  {isAdmin && (
                    <>
                      <button 
                        onClick={() => navigate(`/fields/${f.id}/assign`)} 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                        title="Assign"
                      >
                        <UserPlus size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(f.id)} 
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ViewButton = ({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) => (
  <button 
    onClick={onClick} 
    className={`p-2 rounded-lg transition-all ${active ? "bg-green-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
  >
    {icon}
  </button>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
    <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
       <Search size={32} className="text-slate-300" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No matching fields</h3>
    <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
  </div>
);

const FieldsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
    <div className="h-16 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl" />
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl" />)}
    </div>
  </div>
);