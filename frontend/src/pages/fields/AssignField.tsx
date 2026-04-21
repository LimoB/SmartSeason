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

  /* ================= API QUERIES ================= */
  const { data: field, isLoading: fieldLoading } = useGetFieldByIdQuery(fieldId as number, {
    skip: fieldId === null,
  });

  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();

  /* ================= DATA FILTERING ================= */
  const fieldAgents = useMemo(() => {
    const allUsers = (usersData || []) as User[];
    return allUsers.filter((u) => u.role === "field_agent");
  }, [usersData]);

  /* ================= STATE ================= */
  // We initialize the state but don't force a "double render" with useEffect
  const [selectedAgentId, setSelectedAgentId] = useState<number | string>("");

  /* ================= MUTATION ================= */
  const [assignField, { isLoading: assigning }] = useAssignFieldMutation();

  /* ================= DERIVED STATE ================= */
  // Instead of an Effect, we calculate the "effective" ID for the UI.
  // If the user hasn't touched the dropdown (selectedAgentId is empty),
  // we show the field's current assigned agent.
  const currentAgentValue = selectedAgentId || field?.assignedAgentId || "";

  /* ================= HANDLE ASSIGN ================= */
  const handleAssign = async () => {
    // We use the derived value for the final submission
    const finalAgentId = selectedAgentId || field?.assignedAgentId;

    if (!fieldId || !finalAgentId) {
      toast.error("Please select a field agent");
      return;
    }

    try {
      const payload: AssignFieldRequest = {
        id: fieldId,
        agentId: Number(finalAgentId),
      };

      await assignField(payload).unwrap();
      toast.success("Field assigned successfully");
      navigate(`/fields/${fieldId}`);
    } catch (err: unknown) {
      const error = err as ApiError;
      const message = error?.data?.message ?? "Failed to assign field";
      toast.error(message);
    }
  };

  /* ================= RENDER STATES ================= */
  if (fieldLoading || usersLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading details...</p>
      </div>
    );
  }

  if (!field) {
    return <div className="p-10 text-center text-red-500">Field not found</div>;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-green-600 transition-colors"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Back
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* HEADER SECTION */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="text-green-600" />
            Assign Agent
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Choose a field agent to manage <span className="font-bold text-slate-700 dark:text-slate-300">"{field.name}"</span>
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* FIELD PREVIEW CARD */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold">
              {field.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-green-700 dark:text-green-500 uppercase tracking-wider">Target Field</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{field.name}</p>
            </div>
          </div>

          {/* AGENT SELECTION */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Shield size={16} className="text-slate-400" />
              Available Field Agents
            </label>

            <select
              value={currentAgentValue}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all outline-none"
            >
              <option value="" disabled>Select an agent...</option>
              {fieldAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.fullName} ({agent.email})
                </option>
              ))}
            </select>
            
            {fieldAgents.length === 0 && (
              <p className="text-xs text-amber-600 font-medium">No agents found. Create an agent first.</p>
            )}
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={handleAssign}
            disabled={assigning || !currentAgentValue}
            className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-200 dark:shadow-none flex items-center justify-center gap-2"
          >
            {assigning ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Assigning...
              </>
            ) : (
              "Confirm Assignment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}