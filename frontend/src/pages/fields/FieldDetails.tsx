import { useParams, useNavigate } from "react-router-dom";
import { useGetFieldByIdQuery } from "@/features/fields/fieldApi";
import { ArrowLeft, UserPlus } from "lucide-react";

/* ================= TYPES ================= */
type FieldStage = "planted" | "growing" | "ready" | "harvested";

interface Field {
  id: number;
  name: string;
  cropType: string;
  location?: string;
  currentStage: FieldStage;
}

interface InfoProps {
  label: string;
  value?: string;
}

export default function FieldDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: field,
    isLoading,
  } = useGetFieldByIdQuery(Number(id)) as {
    data?: Field;
    isLoading: boolean;
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!field) return <div className="p-6">Field not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-500"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 space-y-4">
        <h1 className="text-2xl font-bold text-green-500">
          {field.name}
        </h1>

        <Info label="Crop Type" value={field.cropType} />
        <Info label="Location" value={field.location} />
        <Info label="Stage" value={field.currentStage} />

        <button
          onClick={() => navigate(`/fields/${field.id}/assign`)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          <UserPlus size={16} /> Assign Agent
        </button>
      </div>
    </div>
  );
}

/* ================= INFO ROW ================= */
function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-gray-900 dark:text-white font-medium">
        {value ?? "N/A"}
      </p>
    </div>
  );
}