import { useNavigate } from "react-router-dom";
import { useMemo, useState, type ReactNode } from "react";
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
    <div className="space-y-6 min-h-screen transition-colors duration-300 pb-24 px-4 md:px-0">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="w-full">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            {isAdmin ? "Agricultural Fields" : "Assigned Fields"}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isAdmin ? "Overseeing all active farm sectors" : "Monitoring assigned crop zones"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate("/fields/create")}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-xl shadow-green-600/20 transition-all active:scale-95 font-bold"
          >
            <Plus size={20} />
            Create Field
          </button>
        )}
      </header>

      {/* FILTER & SEARCH BAR */}
      <section className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-4 md:p-6 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              placeholder="Search by name, crop..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-green-500 rounded-2xl outline-none transition-all text-sm"
            />
          </div>

          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            {/* View Toggles - Hidden on very small screens to save space */}
            <div className="flex gap-2">
              <ViewButton active={viewMode === "grid"} onClick={() => dispatch(setViewMode("grid"))} icon={<LayoutGrid size={20} />} />
              <ViewButton active={viewMode === "table"} onClick={() => dispatch(setViewMode("table"))} icon={<Table size={20} />} className="hidden sm:flex" />
            </div>

            {/* Mobile Filter Toggle */}
            <button 
               onClick={() => setShowMobileFilters(!showMobileFilters)}
               className={`lg:hidden flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${showMobileFilters ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-slate-800'}`}
            >
               <Filter size={18} /> Filters
            </button>
          </div>
        </div>

        {/* STAGE FILTERS - Scrollable on mobile, flex-wrap on desktop */}
        <div className={`${showMobileFilters ? 'flex' : 'hidden'} lg:flex overflow-x-auto pb-2 lg:pb-0 no-scrollbar`}>
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl w-max lg:w-auto">
            {(["all", "planted", "growing", "ready", "harvested"] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => dispatch(setFilter({ stage: stage as FieldStage | "all" }))}
                className={`px-4 py-2.5 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  filter.stage === stage
                    ? "bg-white dark:bg-slate-700 shadow-md text-green-600 dark:text-green-400"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="w-full">
        {filteredFields.length === 0 ? (
          <EmptyState />
        ) : (viewMode === "grid" || window.innerWidth < 768) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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

/* ================= COMPONENT: FIELD CARD ================= */

function FieldCard({ field, isAdmin, onDelete }: FieldCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="max-w-[70%]">
          <h3 className="font-black text-lg md:text-xl text-gray-900 dark:text-white leading-tight truncate mb-1">{field.name}</h3>
          <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black uppercase rounded-lg">
            {field.cropType}
          </span>
        </div>
        <StageBadge stage={field.currentStage} />
      </div>

      <div className="space-y-3 mb-6 md:mb-8">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <MapPin size={16} className="text-green-600" />
          <span className="text-sm font-medium truncate">{field.location || "North Rift Region"}</span>
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <UserIcon size={16} />
            <span className="text-sm font-semibold truncate">{field.agent?.fullName || "Unassigned"}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-5 border-t border-gray-100 dark:border-slate-800">
        <button 
          onClick={() => navigate(`/fields/${field.id}`)}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-xl font-bold text-sm hover:bg-green-600 hover:text-white transition-all"
        >
          <Eye size={18} />
          View
        </button>

        {isAdmin && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate(`/fields/${field.id}/assign`)}
              className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              <UserPlus size={16} /> Assign
            </button>
            <button 
              onClick={() => onDelete(field.id)}
              className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-slate-800 text-red-500 rounded-xl font-bold text-xs hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <Trash2 size={16} /> Delete
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
    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-sm">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-gray-400 dark:text-gray-500 uppercase text-[10px] font-black tracking-widest">
            <th className="px-8 py-5">Plot Identification</th>
            <th className="px-8 py-5">Crop</th>
            {isAdmin && <th className="px-8 py-5">Agent</th>}
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
          {fields.map((f) => (
            <tr key={f.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="px-8 py-5">
                <p className="font-black text-gray-900 dark:text-white">{f.name}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={10}/> {f.location || "Kenya"}</p>
              </td>
              <td className="px-8 py-5">
                <span className="font-bold text-green-600 text-sm">{f.cropType}</span>
              </td>
              {isAdmin && (
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 font-bold text-xs">
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
                  <button onClick={() => navigate(`/fields/${f.id}`)} className="p-2.5 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-green-600 hover:text-white transition-all">
                    <Eye size={16} />
                  </button>
                  {isAdmin && (
                    <>
                      <button onClick={() => navigate(`/fields/${f.id}/assign`)} className="p-2.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"><UserPlus size={16} /></button>
                      <button onClick={() => onDelete(f.id)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"><Trash2 size={16} /></button>
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
  if (s === 'ready' || s === 'harvested') styles = "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";

  return (
    <span className={`px-3 py-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-full whitespace-nowrap ${styles}`}>
      {stage}
    </span>
  );
}

const ViewButton = ({ active, onClick, icon, className = "" }: { active: boolean; onClick: () => void; icon: ReactNode; className?: string }) => (
  <button
    onClick={onClick}
    className={`${className} p-3 rounded-xl transition-all ${
      active 
        ? "bg-green-600 text-white shadow-lg shadow-green-600/30" 
        : "text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800"
    }`}
  >
    {icon}
  </button>
);

const EmptyState = () => (
  <div className="text-center py-16 md:py-24 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800 px-6">
    <div className="inline-flex p-6 bg-gray-50 dark:bg-slate-800 rounded-full mb-6 text-gray-300">
        <Search size={40} />
    </div>
    <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">No fields matched</h3>
    <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2">Adjust your filters or try a different search term to find what you're looking for.</p>
  </div>
);

const FieldsSkeleton = () => (
  <div className="space-y-6 animate-pulse p-4 md:p-0">
    <div className="h-10 w-48 bg-gray-200 dark:bg-slate-800 rounded-xl" />
    <div className="h-24 w-full bg-gray-200 dark:bg-slate-800 rounded-[2rem]" />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-200 dark:bg-slate-800 rounded-[2.5rem]" />)}
    </div>
  </div>
);