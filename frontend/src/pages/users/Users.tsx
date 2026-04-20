import { useState } from "react";

export default function Users() {
  const [users] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@smartseason.com",
      role: "admin",
    },
    {
      id: 2,
      name: "John Field Agent",
      email: "john@smartseason.com",
      role: "field_agent",
    },
    {
      id: 3,
      name: "Jane Agent",
      email: "jane@smartseason.com",
      role: "field_agent",
    },
  ]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-green-400">
          Users Management
        </h1>
        <p className="text-slate-400">
          Manage system users and roles
        </p>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          >
            <h2 className="font-bold">{u.name}</h2>
            <p className="text-slate-400 text-sm">{u.email}</p>

            <span
              className={`inline-block mt-3 px-3 py-1 text-xs rounded ${
                u.role === "admin"
                  ? "bg-green-500 text-black"
                  : "bg-slate-700 text-white"
              }`}
            >
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}