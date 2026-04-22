import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowLeft, UserCheck, Shield } from "lucide-react";

import {
  useAssignFieldMutation,
  useGetFieldByIdQuery,
} from "@/features/fields/fieldApi";

import { useGetUsersQuery } from "@/features/users/userApi";
import type { AssignFieldRequest } from "@/features/fields/fieldApi";
import type { User } from "@/types/types";
import { useAppSelector } from "@/app/hooks";
import { toast } from "react-toastify";

/* ================= ERROR TYPE ================= */
type ApiError = {
  data?: {
    message?: string;
  };
};

export default function AssignField() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fieldId = id ? Number(id) : null;

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  /* ================= ALL HOOKS (MUST STAY HERE) ================= */

  const { data: field, isLoading: fieldLoading } =
    useGetFieldByIdQuery(fieldId ?? 0, {
      skip: fieldId === null,
    });

  const { data: usersData, isLoading: usersLoading } =
    useGetUsersQuery();

  const [assignField, { isLoading: assigning }] =
    useAssignFieldMutation();

  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(
    null
  );

  const fieldAgents = useMemo(() => {
    const allUsers = (usersData || []) as User[];
    return allUsers.filter((u) => u.role === "field_agent");
  }, [usersData]);

  const effectiveAgentId =
    selectedAgentId ?? field?.assignedAgentId ?? null;

  /* ================= HANDLERS ================= */

  const handleAssign = async () => {
    if (!fieldId || !effectiveAgentId) {
      toast.error("Please select a field agent");
      return;
    }

    try {
      const payload: AssignFieldRequest = {
        id: fieldId,
        agentId: effectiveAgentId,
      };

      await assignField(payload).unwrap();

      toast.success("Field assigned successfully");
      navigate(`/fields/${fieldId}`);
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error?.data?.message ?? "Failed to assign field");
    }
  };

  /* ================= AFTER HOOKS (SAFE CONDITIONAL RETURNS) ================= */

  if (!isAdmin) {
    return (
      <div className="p-10 text-center text-red-500 font-medium">
        Access denied. Only admins can assign fields.
      </div>
    );
  }

  if (fieldLoading || usersLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading details...</p>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="p-10 text-center text-red-500">
        Field not found
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-green-600 transition-colors"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="p-6 border-b bg-slate-50 dark:bg-slate-800/30">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <UserCheck className="text-green-600" />
            Assign Agent
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Assign a field agent to{" "}
            <span className="font-bold">{field.name}</span>
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* FIELD INFO */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-100">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold">
              {field.name.charAt(0)}
            </div>

            <div>
              <p className="text-xs font-bold text-green-700 uppercase">
                Target Field
              </p>
              <p className="text-lg font-bold">{field.name}</p>
            </div>
          </div>

          {/* SELECT */}
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2">
              <Shield size={16} />
              Field Agents
            </label>

            <select
              value={effectiveAgentId ?? ""}
              onChange={(e) =>
                setSelectedAgentId(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="w-full px-4 py-3 rounded-2xl border bg-slate-50 dark:bg-slate-800"
            >
              <option value="">Select an agent...</option>

              {fieldAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.fullName} ({agent.email})
                </option>
              ))}
            </select>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleAssign}
            disabled={assigning || !effectiveAgentId}
            className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl disabled:opacity-50"
          >
            {assigning ? "Assigning..." : "Confirm Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}