import { useParams, useNavigate } from "react-router-dom";
import { useGetFieldByIdQuery } from "@/features/fields/fieldApi";
import { useGetUsersQuery } from "@/features/users/userApi";
import {
  ArrowLeft,
  UserPlus,
  Calendar,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { useMemo } from "react";
import type { User } from "@/types/types";

/* ================= INFO TYPE ================= */
interface InfoProps {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}

export default function FieldDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.auth.user);
  const isAdmin = currentUser?.role === "admin";

  const fieldId = id ? Number(id) : undefined;
  const isValidId = fieldId !== undefined && !Number.isNaN(fieldId);

  /* ================= QUERIES ================= */
  const { data: field, isLoading: isFieldLoading } =
    useGetFieldByIdQuery(fieldId as number, {
      skip: !isValidId,
    });

  const { data: usersData, isLoading: isUsersLoading } =
    useGetUsersQuery();

  /* ================= STABLE DEPENDENCIES ================= */
  const assignedAgentId = field?.assignedAgentId ?? null;

  const users: User[] = useMemo(() => {
    return (usersData ?? []) as User[];
  }, [usersData]);

  /* ================= AGENT RESOLVE (FIXED) ================= */
  const assignedAgent = useMemo(() => {
    if (!assignedAgentId) return null;

    return users.find((u) => u.id === assignedAgentId) ?? null;
  }, [assignedAgentId, users]);

  /* ================= LOADING ================= */
  if (isFieldLoading || isUsersLoading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">
          Fetching field details...
        </p>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (!isValidId) {
    return (
      <div className="p-10 text-center text-red-500">
        Invalid field ID
      </div>
    );
  }

  if (!field) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Field not found</h2>
        <button
          onClick={() => navigate("/fields")}
          className="mt-4 text-green-600 font-medium"
        >
          Go back
        </button>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* BACK */}
      <button
        onClick={() => navigate("/fields")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-green-600"
      >
        <ArrowLeft size={18} />
        Back to Fields
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="bg-green-600 h-24 sm:h-32 w-full relative">
          <div className="absolute -bottom-6 left-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow">
            <MapPin size={24} className="text-green-600" />
          </div>
        </div>

        <div className="pt-10 p-8 space-y-8">
          {/* TITLE */}
          <div>
            <h1 className="text-3xl font-extrabold">{field.name}</h1>
            <p className="text-slate-500">
              {field.cropType} •{" "}
              <span className="capitalize">
                {field.currentStage}
              </span>
            </p>
          </div>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Info
              label="Location"
              value={field.location}
              icon={<MapPin size={16} />}
            />

            <Info
              label="Planting Date"
              value={
                field.plantingDate
                  ? new Date(field.plantingDate).toLocaleDateString()
                  : "Not recorded"
              }
              icon={<Calendar size={16} />}
            />

            <Info
              label="Expected Harvest"
              value={
                field.expectedHarvestDate
                  ? new Date(
                      field.expectedHarvestDate
                    ).toLocaleDateString()
                  : "Pending"
              }
              icon={<Calendar size={16} />}
            />

            {/* AGENT */}
            <div className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <UserIcon size={18} className="text-green-600" />
              <div>
                <p className="text-xs font-bold text-slate-400">
                  Assigned Agent
                </p>
                <p className="font-semibold">
                  {assignedAgent?.fullName ||
                    "No Agent Assigned"}
                </p>
                {assignedAgent && (
                  <p className="text-xs text-slate-500">
                    {assignedAgent.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            {isAdmin && (
              <button
                onClick={() =>
                  navigate(`/fields/${field.id}/assign`)
                }
                className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-2xl"
              >
                <UserPlus size={18} />
                {field.assignedAgentId
                  ? "Reassign Agent"
                  : "Assign Agent"}
              </button>
            )}

            <button
              onClick={() =>
                navigate(`/fields/${field.id}/edit`)
              }
              className="px-5 py-3 border rounded-2xl"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= INFO ================= */
function Info({ label, value, icon }: InfoProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="font-medium text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}