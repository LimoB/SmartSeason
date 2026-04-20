import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateFieldMutation } from "@/features/fields/fieldApi";
import { ArrowLeft } from "lucide-react";

/* ================= TYPES ================= */
interface CreateFieldRequest {
  name: string;
  cropType: string;
  location: string;
  plantingDate: string;
  expectedHarvestDate: string;
  assignedAgentId: number | null;
}

type FormState = Omit<CreateFieldRequest, "assignedAgentId">;

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function CreateField() {
  const navigate = useNavigate();
  const [createField, { isLoading }] = useCreateFieldMutation();

  const [form, setForm] = useState<FormState>({
    name: "",
    cropType: "",
    location: "",
    plantingDate: "",
    expectedHarvestDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await createField({
      ...form,
      assignedAgentId: null,
    });

    navigate("/fields");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-500"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold text-green-500">
        Create Field
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800"
      >
        <Input
          name="name"
          label="Field Name"
          value={form.name}
          onChange={handleChange}
        />

        <Input
          name="cropType"
          label="Crop Type"
          value={form.cropType}
          onChange={handleChange}
        />

        <Input
          name="location"
          label="Location"
          value={form.location}
          onChange={handleChange}
        />

        <Input
          name="plantingDate"
          label="Planting Date"
          type="date"
          value={form.plantingDate}
          onChange={handleChange}
        />

        <Input
          name="expectedHarvestDate"
          label="Expected Harvest"
          type="date"
          value={form.expectedHarvestDate}
          onChange={handleChange}
        />

        <button
          disabled={isLoading}
          className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          {isLoading ? "Creating..." : "Create Field"}
        </button>
      </form>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */
function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500 dark:text-slate-400">
        {label}
      </label>

      <input
        {...props}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      />
    </div>
  );
}