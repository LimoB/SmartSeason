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
} from "lucide-react";

import {
  useGetFieldsQuery,
  useDeleteFieldMutation,
} from "@/features/fields/fieldApi";
import { useGetUsersQuery } from "@/features/users/userApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setFilter,
  setSearch,
  setViewMode,
} from "@/features/fields/fieldSlice";

import type { Field, User, FieldStage } from "@/types/types";

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

type ViewButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
};

export default function Fields() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isAdmin = currentUser?.role === "admin";

  const { data: fieldData, isLoading: fieldsLoading } = useGetFieldsQuery();
  const { data: userData, isLoading: usersLoading } = useGetUsersQuery();
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
    if (confirm("Delete this field?")) {
      try {
        await deleteField(id).unwrap();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (fieldsLoading || usersLoading) return <FieldsSkeleton />;

  return (
    <div className="space-y-6 min-h-screen transition-colors duration-300">
      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Fields</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and monitor all agricultural plots</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate("/fields/create")}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:opacity-90 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span className="font-semibold">Add Field</span>
          </button>
        )}
      </header>

      {/* FILTER BAR */}
      <section className="flex flex-col lg:flex-row gap-4 justify-between bg-white dark:bg-dark-bg p-4 rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm">
        <div className="relative w-full lg:w-96">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search fields, crops, or agents..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-surface/50 border border-transparent focus:border-primary-500 dark:focus:border-primary-500 rounded-xl outline-none transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-dark-surface p-1 rounded-xl">
            {(["all", "planted", "growing", "ready", "harvested"] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => dispatch(setFilter({ stage: stage as FieldStage | "all" }))}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-tighter transition-all ${
                  filter.stage === stage
                    ? "bg-white dark:bg-gray-700 shadow-sm text-primary-500"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-gray-200 dark:border-dark-border mx-1 hidden sm:block" />

          <div className="flex gap-1">
            <ViewButton
              active={viewMode === "grid"}
              onClick={() => dispatch(setViewMode("grid"))}
              icon={<LayoutGrid size={20} />}
            />
            <ViewButton
              active={viewMode === "table"}
              onClick={() => dispatch(setViewMode("table"))}
              icon={<Table size={20} />}
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      {filteredFields.length === 0 ? (
        <EmptyState />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

/* ================= FIELD CARD ================= */

function FieldCard({ field, isAdmin, onDelete }: FieldCardProps) {
  const navigate = useNavigate();

  return (
    <div className="group bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
            {field.name}
          </h3>
          <p className="text-primary-500 text-xs font-bold uppercase tracking-wider">{field.cropType}</p>
        </div>
        <StageBadge stage={field.currentStage} />
      </div>

      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-6">
        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
            <UserIcon size={12} />
        </div>
        <span className="text-xs font-medium">{field.agent?.fullName || "Unassigned"}</span>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-dark-border">
        <button 
          onClick={() => navigate(`/fields/${field.id}`)}
          className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-lg transition-colors"
        >
          <Eye size={18} />
        </button>

        {isAdmin && (
          <div className="flex gap-1">
            <button
              onClick={() => navigate(`/fields/${field.id}/assign`)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
            >
              <UserPlus size={18} />
            </button>
            <button 
              onClick={() => onDelete(field.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= FIELD TABLE ================= */

function FieldTable({ fields, isAdmin, onDelete }: FieldTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto bg-white dark:bg-dark-bg rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-dark-surface/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-black tracking-widest">
            <th className="px-6 py-4">Field Name</th>
            <th className="px-6 py-4">Crop Type</th>
            <th className="px-6 py-4">Assigned Agent</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
          {fields.map((f) => (
            <tr key={f.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-surface/20 transition-colors">
              <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{f.name}</td>
              <td className="px-6 py-4 text-primary-500 font-semibold text-sm">{f.cropType}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                   <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-dark-surface border border-gray-200 dark:border-dark-border flex items-center justify-center text-[10px] font-bold">
                      {f.agent?.fullName?.charAt(0) || '?'}
                   </div>
                   <span className="text-sm text-gray-600 dark:text-gray-300">{f.agent?.fullName || "Unassigned"}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                 <StageBadge stage={f.currentStage} />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => navigate(`/fields/${f.id}`)} className="p-2 text-gray-400 hover:text-primary-500 transition-colors"><Eye size={18} /></button>
                  {isAdmin && (
                    <>
                      <button onClick={() => navigate(`/fields/${f.id}/assign`)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><UserPlus size={18} /></button>
                      <button onClick={() => onDelete(f.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
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

/* ================= HELPERS ================= */

function StageBadge({ stage }: { stage: string }) {
  const s = stage.toLowerCase();
  let styles = "bg-gray-100 text-gray-600 dark:bg-dark-surface dark:text-gray-400";
  
  if (s === 'planted') styles = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/20";
  if (s === 'growing') styles = "bg-primary-500/10 text-primary-500 dark:bg-primary-500/20 dark:text-primary-400 border border-primary-500/20";
  if (s === 'ready' || s === 'harvested') styles = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/20";

  return (
    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded-full border ${styles}`}>
      {stage}
    </span>
  );
}

const ViewButton = ({ active, onClick, icon }: ViewButtonProps) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-xl transition-all ${
      active 
        ? "bg-primary-500/10 text-primary-500 shadow-sm border border-primary-500/20" 
        : "text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface"
    }`}
  >
    {icon}
  </button>
);

const EmptyState = () => (
  <div className="text-center py-20 bg-white dark:bg-dark-bg rounded-3xl border-2 border-dashed border-gray-200 dark:border-dark-border">
    <div className="inline-flex p-4 bg-gray-50 dark:bg-dark-surface rounded-full mb-4 text-gray-400">
        <Search size={32} />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white">No fields found</h3>
    <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms.</p>
  </div>
);

const FieldsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-10 w-48 bg-gray-200 dark:bg-dark-surface rounded-lg" />
    <div className="h-16 w-full bg-gray-200 dark:bg-dark-surface rounded-2xl" />
    <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-200 dark:bg-dark-surface rounded-2xl" />)}
    </div>
  </div>
);