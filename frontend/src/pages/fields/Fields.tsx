import { useNavigate } from "react-router-dom";
import { useMemo, useState, type ReactNode } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  Table,
  Trash2,
  User as UserIcon,
  Eye,
  MapPin,
  Filter,
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isAdmin = currentUser?.role === "admin";

  const { data: fieldData, isLoading: fieldsLoading } = useGetFieldsQuery();
  
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
    // "w-full" and no outer "px" for desktop to sit flush with sidebar
    <div className={`w-full space-y-4 md:space-y-8 pb-10 transition-all duration-500 ${fieldsLoading || (isAdmin && usersLoading) ? "opacity-60" : "opacity-100"}`}>
      
      {/* HEADER - Flush on desktop, minimal padding mobile */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-3 md:px-0">
        <div>
          <h1 className="text-xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {isAdmin ? "Agricultural Fields" : "My Assigned Fields"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isAdmin ? "Overseeing active farm sectors" : "Monitoring your crop zones"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate("/fields/create")}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg shadow-green-600/20 active:scale-95 transition-transform font-bold text-sm"
          >
            <Plus size={18} />
            Create Field
          </button>
        )}
      </header>

      {/* FILTER & SEARCH BAR - Flush on desktop */}
      <section className="mx-3 md:mx-0 flex flex-col gap-4 bg-white dark:bg-slate-900 p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:w-96">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              placeholder="Search name, crop..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-green-500/50 rounded-xl outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            <div className="flex gap-2">
              <ViewButton active={viewMode === "grid"} onClick={() => dispatch(setViewMode("grid"))} icon={<LayoutGrid size={18} />} />
              <ViewButton active={viewMode === "table"} onClick={() => dispatch(setViewMode("table"))} icon={<Table size={18} />} className="hidden sm:flex" />
            </div>

            <button 
               onClick={() => setShowMobileFilters(!showMobileFilters)}
               className={`lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${showMobileFilters ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
            >
               <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className={`${showMobileFilters ? 'flex' : 'hidden'} lg:flex overflow-x-auto no-scrollbar`}>
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
            {(["all", "planted", "growing", "ready", "harvested"] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => dispatch(setFilter({ stage: stage as FieldStage | "all" }))}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter.stage === stage
                    ? "bg-white dark:bg-slate-700 shadow-sm text-green-600 dark:text-green-400"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT GRID/TABLE - Flush layout */}
      <div className="px-3 md:px-0">
        {filteredFields.length === 0 ? (
          <EmptyState />
        ) : (viewMode === "grid" || window.innerWidth < 768) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filteredFields.map((field) => (
              <FieldCard key={field.id} field={field} isAdmin={isAdmin} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <FieldTable fields={filteredFields} isAdmin={isAdmin} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENT: CARD ================= */

function FieldCard({ field, isAdmin, onDelete }: FieldCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl md:rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="max-w-[65%]">
          <h3 className="font-bold text-base md:text-lg text-slate-900 dark:text-white leading-tight truncate">{field.name}</h3>
          <span className="text-[10px] font-black uppercase text-green-600 tracking-wider">
            {field.cropType}
          </span>
        </div>
        <StageBadge stage={field.currentStage} />
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
          <MapPin size={14} className="text-green-600 opacity-60" />
          <span className="truncate">{field.location || "North Rift"}</span>
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <UserIcon size={14} className="opacity-60" />
            <span className="truncate">{field.agent?.fullName || "No Agent"}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t border-slate-50 dark:border-slate-800">
        <button 
          onClick={() => navigate(`/fields/${field.id}`)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-green-600 hover:text-white transition-all"
        >
          <Eye size={16} /> View Details
        </button>

        {isAdmin && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate(`/fields/${field.id}/assign`)}
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-800 text-blue-500 rounded-xl font-bold text-[10px] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              Assign
            </button>
            <button 
              onClick={() => onDelete(field.id)}
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-800 text-red-500 rounded-xl font-bold text-[10px] hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENT: TABLE ================= */

function FieldTable({ fields, isAdmin, onDelete }: FieldTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em]">
            <th className="px-6 py-4">Identification</th>
            <th className="px-6 py-4">Crop</th>
            {isAdmin && <th className="px-6 py-4">Agent</th>}
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {fields.map((f) => (
            <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{f.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">{f.location || "Kenya"}</p>
              </td>
              <td className="px-6 py-4 text-sm font-bold text-green-600">{f.cropType}</td>
              {isAdmin && (
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{f.agent?.fullName || "—"}</span>
                </td>
              )}
              <td className="px-6 py-4"><StageBadge stage={f.currentStage} /></td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button onClick={() => navigate(`/fields/${f.id}`)} className="p-2 text-slate-400 hover:text-green-600 transition-all"><Eye size={16} /></button>
                  {isAdmin && (
                    <button onClick={() => onDelete(f.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
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
  let styles = "bg-slate-100 text-slate-500";
  if (s === 'planted') styles = "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400";
  if (s === 'growing') styles = "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
  if (s === 'ready' || s === 'harvested') styles = "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400";

  return (
    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter rounded-full whitespace-nowrap ${styles}`}>
      {stage}
    </span>
  );
}

const ViewButton = ({ active, onClick, icon, className = "" }: { active: boolean; onClick: () => void; icon: ReactNode; className?: string }) => (
  <button
    onClick={onClick}
    className={`${className} p-2.5 rounded-lg transition-all ${
      active ? "bg-green-600 text-white shadow-md shadow-green-600/20" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`}
  >
    {icon}
  </button>
);

const EmptyState = () => (
  <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
    <Search size={32} className="mx-auto mb-3 opacity-20 text-slate-400" />
    <h3 className="text-lg font-black text-slate-900 dark:text-white">No results</h3>
    <p className="text-slate-500 text-xs mt-1">Try adjusting your filters.</p>
  </div>
);

const FieldsSkeleton = () => (
  <div className="space-y-6 animate-pulse px-3 md:px-0">
    <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
    <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl" />
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />)}
    </div>
  </div>
);