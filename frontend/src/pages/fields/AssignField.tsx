import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";

import {
  useAssignFieldMutation,
  useGetFieldByIdQuery,
} from "@/features/fields/fieldApi";

import { useGetUsersQuery } from "@/features/users/userApi";

import type { AssignFieldRequest } from "@/features/fields/fieldApi";
import type { User } from "@/types/types";

export default function AssignField() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fieldId = id ? Number(id) : null;

  /* ================= FIELD ================= */
  const { data: field, isLoading: fieldLoading } =
    useGetFieldByIdQuery(fieldId as number, {
      skip: fieldId === null,
    });

  /* ================= USERS ================= */
  const { data: users = [], isLoading: usersLoading } =
    useGetUsersQuery();

  const fieldAgents: User[] = useMemo(() => {
    return users.filter((u) => u.role === "field_agent");
  }, [users]);

  /* ================= MUTATION ================= */
  const [assignField, { isLoading: assigning }] =
    useAssignFieldMutation();

  const [agentId, setAgentId] = useState<number | "">("");

  /* ================= AUTO SELECT FIRST AGENT ================= */
  if (!agentId && fieldAgents.length > 0) {
    setAgentId(fieldAgents[0].id);
  }

  /* ================= HANDLE ASSIGN ================= */
  const handleAssign = async () => {
    if (!fieldId || !agentId) return;

    const payload: AssignFieldRequest = {
      id: fieldId,
      agentId: Number(agentId),
    };

    await assignField(payload);

    navigate("/fields");
  };

  /* ================= LOADING ================= */
  if (fieldLoading || usersLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!field) {
    return <div className="p-6">Field not found</div>;
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-500"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold text-green-500">
        Assign Field
      </h1>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 space-y-4">
        {/* FIELD INFO */}
        <div>
          <p className="text-sm text-gray-500">Field</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {field.name}
          </p>
        </div>

        {/* AGENT SELECT */}
        <div>
          <label className="text-sm text-gray-500">
            Select Field Agent
          </label>

          <select
            value={agentId}
            onChange={(e) => setAgentId(Number(e.target.value))}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            {fieldAgents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleAssign}
          disabled={assigning || !agentId}
          className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          {assigning ? "Assigning..." : "Assign Agent"}
        </button>
      </div>
    </div>
  );
}