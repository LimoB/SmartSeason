import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  Table,
  UserPlus,
  Trash2,
} from "lucide-react";

import {
  useGetFieldsQuery,
  useDeleteFieldMutation,
} from "@/features/fields/fieldApi";

import {
  useAppDispatch,
  useAppSelector,
} from "@/app/hooks";

import {
  setFilter,
  setSearch,
  setViewMode,
  setSelectedField,
} from "@/features/fields/fieldSlice";

/* ================= TYPES ================= */
type FieldStage = "all" | "planted" | "growing" | "ready" | "harvested";

interface Field {
  id: number;
  name: string;
  cropType: string;
  currentStage: FieldStage;
}

export default function Fields() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: fields = [], isLoading } = useGetFieldsQuery();

  const [deleteField] = useDeleteFieldMutation();

  const { filter, search, viewMode } = useAppSelector(
    (state) => state.fields
  ) as {
    filter: FieldStage;
    search: string;
    viewMode: "grid" | "table";
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredFields = useMemo(() => {
    return (fields as Field[])
      .filter((f) =>
        filter === "all" ? true : f.currentStage === filter
      )
      .filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
      );
  }, [fields, filter, search]);

  /* ================= ACTIONS ================= */
  const handleDelete = async (id: number) => {
    if (confirm("Delete this field?")) {
      await deleteField(id);
    }
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return <div className="p-6">Loading fields...</div>;
  }

  const filterOptions: FieldStage[] = [
    "all",
    "planted",
    "growing",
    "ready",
    "harvested",
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-green-500">Fields</h1>

        <button
          onClick={() => navigate("/fields/create")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <Plus size={16} />
          Create Field
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        {/* SEARCH */}
        <div className="relative w-full md:w-72">
          <Search
            size={16}
            className="absolute left-3 top-2.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search fields..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="
              w-full pl-9 pr-3 py-2 rounded-lg
              border border-gray-200 dark:border-slate-700
              bg-white dark:bg-slate-900
              text-sm
              focus:outline-none focus:ring-2 focus:ring-green-500
            "
          />
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => dispatch(setFilter(f))}
              className={`
                px-3 py-1 text-xs rounded-full border transition
                ${
                  filter === f
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>

        {/* VIEW MODE */}
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(setViewMode("grid"))}
            className={`p-2 rounded ${
              viewMode === "grid"
                ? "bg-green-500 text-white"
                : "bg-gray-100 dark:bg-slate-800"
            }`}
          >
            <LayoutGrid size={16} />
          </button>

          <button
            onClick={() => dispatch(setViewMode("table"))}
            className={`p-2 rounded ${
              viewMode === "table"
                ? "bg-green-500 text-white"
                : "bg-gray-100 dark:bg-slate-800"
            }`}
          >
            <Table size={16} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {viewMode === "grid" ? (
        <div className="grid md:grid-cols-3 gap-4">
          {filteredFields.map((field) => (
            <div
              key={field.id}
              className="
                p-4 rounded-xl border
                bg-white dark:bg-slate-900
                border-gray-200 dark:border-slate-800
                space-y-3
              "
            >
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {field.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {field.cropType}
                </p>
              </div>

              <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-600">
                {field.currentStage}
              </span>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => {
                    dispatch(setSelectedField(field.id));
                    navigate(`/fields/${field.id}`);
                  }}
                  className="text-sm text-blue-500"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    navigate(`/fields/${field.id}/assign`)
                  }
                  className="text-sm text-green-500"
                >
                  <UserPlus size={14} />
                </button>

                <button
                  onClick={() => handleDelete(field.id)}
                  className="text-sm text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-slate-800 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th>Crop</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredFields.map((field) => (
                <tr
                  key={field.id}
                  className="border-t border-gray-200 dark:border-slate-800"
                >
                  <td className="p-3">{field.name}</td>
                  <td>{field.cropType}</td>
                  <td>{field.currentStage}</td>
                  <td className="flex gap-2 p-3">
                    <button
                      onClick={() =>
                        navigate(`/fields/${field.id}`)
                      }
                      className="text-blue-500"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/fields/${field.id}/assign`)
                      }
                      className="text-green-500"
                    >
                      <UserPlus size={14} />
                    </button>

                    <button
                      onClick={() => handleDelete(field.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}