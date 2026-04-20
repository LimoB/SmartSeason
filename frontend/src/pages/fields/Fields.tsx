import { useState } from "react";

export default function Fields() {
  const [fields] = useState([
    {
      id: 1,
      name: "Maize Field A",
      cropType: "Maize",
      stage: "Growing",
      agent: "John Doe",
    },
    {
      id: 2,
      name: "Wheat Field B",
      cropType: "Wheat",
      stage: "Planted",
      agent: "Jane Smith",
    },
    {
      id: 3,
      name: "Rice Field C",
      cropType: "Rice",
      stage: "Ready",
      agent: "Mike Johnson",
    },
  ]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-green-400">
          Fields Management
        </h1>
        <p className="text-slate-400">
          Monitor all agricultural fields
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Crop</th>
              <th className="p-3">Stage</th>
              <th className="p-3">Agent</th>
            </tr>
          </thead>

          <tbody>
            {fields.map((f) => (
              <tr key={f.id} className="border-t border-slate-800">
                <td className="p-3">{f.name}</td>
                <td className="p-3">{f.cropType}</td>
                <td className="p-3 text-green-400">{f.stage}</td>
                <td className="p-3 text-slate-400">{f.agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}