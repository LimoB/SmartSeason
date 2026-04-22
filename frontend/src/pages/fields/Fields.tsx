import { useNavigate } from "react-router-dom";
import { useMemo, type ReactNode } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  Table,
  UserPlus,
  Trash2,
  User as UserIcon,
  Eye,
  MapPin,
} from "lucide-react";

import {
  useGetFieldsQuery,
  useDeleteFieldMutation,
} from "../../features/fields/fieldApi";
import { useGetUsersQuery } from "../../features/users/userApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setFilter,
  setSearch,
  setViewMode,
} from "../../features/fields/fieldSlice";

import type { Field, User, FieldStage } from "../../types/types";

/* ================= TYPES ================= */
type FieldWithAgent = Field & {
  agent?: { fullName: string } | null;
};

type FieldCardProps = {
  field: FieldWithAgent;
  isAdmin: boolean;
  onDelete: (id: number) => void;
};

type FieldTableProps = {
  fields: FieldWithAgent[];
  isAdmin: boolean;
  onDelete: (id: number) => void;
};

export default function Fields() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isAdmin = currentUser?.role === "admin";

  const { data: fieldData, isLoading: fieldsLoading } = useGetFieldsQuery();
  
  // 🔥 FIX: Skip fetching users if not admin to prevent 403 error
  const { data: userData, isLoading: usersLoading } = useGetUsersQuery(undefined, {
    skip: !isAdmin
  });

  const [deleteField] = useDeleteFieldMutation();
  const { filter, search, viewMode } = useAppSelector((state) => state.fields);

  const fields: FieldWithAgent[] = useMemo(() => {
    const rawFields = (fieldData || []) as Field[];
    const allUsers = (userData || []) as User[];

    return rawFields.map((field) => {
      const agent = allUsers.find((u) => u.id === field.assignedAgentId);
      return {
        ...field,
        agent: agent ? { fullName: agent.fullName } : null,
      };
    });
  }, [fieldData, userData]);

  const filteredFields = useMemo(() => {
    return fields.filter((f) => {
      if (filter.stage !== "all" && f.currentStage !== filter.stage) return false;
      // Agents only see their assigned fields
      if (!isAdmin && f.assignedAgentId !== currentUser?.id) return false;
      
      const q = search.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.cropType.toLowerCase().includes(q) ||
        f.agent?.fullName?.toLowerCase().includes(q)
      );
    });
  }, [fields, filter, search, isAdmin, currentUser]);

  const handleDelete = async (id: number) => {
    if (!isAdmin) return;
    if (confirm("Are you sure you want to delete this field permanently?")) {
      try {
        await deleteField(id).unwrap();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (fieldsLoading || (isAdmin && usersLoading)) return <FieldsSkeleton />;

  return (
    <div className="space-y-6 min-h-screen transition-colors duration-300 pb-20">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            {isAdmin ? "All Agricultural Fields" : "My Assigned Fields"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isAdmin ? "Overseeing all active farm sectors" : "Monitoring your assigned crop zones"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate("/fields/create")}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-500/20 transition-all active:scale-95 font-bold"
          >
            <Plus size={20} />
            Create New Field
          </button>
        )}
      </header>

      {/* FILTER & SEARCH BAR */}
      <section className="flex flex-col lg:flex-row gap-4 justify-between bg-white dark:bg-dark-surface p-4 rounded-[2rem] border border-gray-200 dark:border-dark-border shadow-sm">
        <div className="relative w-full lg:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search by name, crop, or location..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-bg/50 border-none focus:ring-2 focus:ring-primary-500/50 rounded-2xl outline-none transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-dark-bg p-1.5 rounded-2xl">
            {(["all", "planted", "growing", "ready", "harvested"] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => dispatch(setFilter({ stage: stage as FieldStage | "all" }))}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                  filter.stage === stage
                    ? "bg-white dark:bg-dark-surface shadow-md text-primary-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>

          <div className="flex gap-2 ml-auto lg:ml-0">
            <ViewButton active={viewMode === "grid"} onClick={() => dispatch(setViewMode("grid"))} icon={<LayoutGrid size={20} />} />
            <ViewButton active={viewMode === "table"} onClick={() => dispatch(setViewMode("table"))} icon={<Table size={20} />} />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      {filteredFields.length === 0 ? (
        <EmptyState />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFields.map((field) => (
            <FieldCard key={field.id} field={field} isAdmin={isAdmin} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <FieldTable fields={filteredFields} isAdmin={isAdmin} onDelete={handleDelete} />
      )}
    </div>
  );
}

/* ================= COMPONENT: FIELD CARD ================= */

function FieldCard({ field, isAdmin, onDelete }: FieldCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-black text-xl text-gray-900 dark:text-white leading-tight mb-1">{field.name}</h3>
          <span className="px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase rounded-lg">
            {field.cropType}
          </span>
        </div>
        <StageBadge stage={field.currentStage} />
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <MapPin size={16} className="text-primary-500" />
          <span className="text-sm font-medium">{field.location || "North Rift Region"}</span>
        </div>
        
        {/* Only show agent to Admins */}
        {isAdmin && (
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <UserIcon size={16} />
            <span className="text-sm font-semibold">{field.agent?.fullName || "Awaiting Assignment"}</span>
          </div>
        )}
      </div>

      {/* ACTION AREA - LABELED BUTTONS */}
      <div className="grid grid-cols-1 gap-2 pt-5 border-t border-gray-100 dark:border-dark-border">
        <button 
          onClick={() => navigate(`/fields/${field.id}`)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-dark-bg text-gray-700 dark:text-gray-200 rounded-2xl font-bold text-sm hover:bg-primary-500 hover:text-white transition-all"
        >
          <Eye size={18} />
          View Details
        </button>

        {isAdmin && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate(`/fields/${field.id}/assign`)}
              className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-dark-border text-blue-600 rounded-2xl font-bold text-xs hover:bg-blue-50 transition-all"
            >
              <UserPlus size={16} />
              Assign
            </button>
            <button 
              onClick={() => onDelete(field.id)}
              className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-dark-border text-red-500 rounded-2xl font-bold text-xs hover:bg-red-50 transition-all"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENT: FIELD TABLE ================= */

function FieldTable({ fields, isAdmin, onDelete }: FieldTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto bg-white dark:bg-dark-surface rounded-[2rem] border border-gray-200 dark:border-dark-border shadow-sm">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-gray-50/50 dark:bg-dark-bg/50 text-gray-400 dark:text-gray-500 uppercase text-[10px] font-black tracking-widest">
            <th className="px-8 py-5">Plot Identification</th>
            <th className="px-8 py-5">Crop</th>
            {isAdmin && <th className="px-8 py-5">Agent Responsible</th>}
            <th className="px-8 py-5">Growth Status</th>
            <th className="px-8 py-5 text-right">Management</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
          {fields.map((f) => (
            <tr key={f.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-bg/10 transition-colors group">
              <td className="px-8 py-5">
                <p className="font-black text-gray-900 dark:text-white">{f.name}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={10}/> {f.location || "Kenya"}</p>
              </td>
              <td className="px-8 py-5">
                <span className="font-bold text-primary-500 text-sm">{f.cropType}</span>
              </td>
              {isAdmin && (
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold text-xs">
                      {f.agent?.fullName?.charAt(0) || '?'}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{f.agent?.fullName || "Unassigned"}</span>
                  </div>
                </td>
              )}
              <td className="px-8 py-5">
                 <StageBadge stage={f.currentStage} />
              </td>
              <td className="px-8 py-5">
                <div className="flex justify-end gap-2">
                  <button onClick={() => navigate(`/fields/${f.id}`)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-bg rounded-xl text-xs font-bold hover:bg-primary-500 hover:text-white transition-all">
                    <Eye size={14} /> Details
                  </button>
                  {isAdmin && (
                    <>
                      <button onClick={() => navigate(`/fields/${f.id}/assign`)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><UserPlus size={18} /></button>
                      <button onClick={() => onDelete(f.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
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

/* ================= UI HELPERS ================= */

function StageBadge({ stage }: { stage: string }) {
  const s = stage.toLowerCase();
  let styles = "bg-gray-100 text-gray-600";
  
  if (s === 'planted') styles = "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400";
  if (s === 'growing') styles = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
  if (s === 'ready' || s === 'harvested') styles = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";

  return (
    <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full ${styles}`}>
      {stage}
    </span>
  );
}

const ViewButton = ({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: ReactNode }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-2xl transition-all ${
      active 
        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" 
        : "text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-bg"
    }`}
  >
    {icon}
  </button>
);

const EmptyState = () => (
  <div className="text-center py-24 bg-white dark:bg-dark-surface rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-dark-border">
    <div className="inline-flex p-6 bg-gray-50 dark:bg-dark-bg rounded-full mb-6 text-gray-300">
        <Search size={48} />
    </div>
    <h3 className="text-2xl font-black text-gray-900 dark:text-white">No fields matched</h3>
    <p className="text-gray-500 max-w-xs mx-auto mt-2">Adjust your filters or try a different search term to find what you're looking for.</p>
  </div>
);

const FieldsSkeleton = () => (
  <div className="space-y-6 animate-pulse p-4">
    <div className="h-12 w-64 bg-gray-200 dark:bg-dark-border rounded-2xl" />
    <div className="h-20 w-full bg-gray-200 dark:bg-dark-border rounded-[2rem]" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-200 dark:bg-dark-border rounded-[2.5rem]" />)}
    </div>
  </div>
);