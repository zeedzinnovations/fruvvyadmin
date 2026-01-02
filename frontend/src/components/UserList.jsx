import React, { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function UserList() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/signup/getUsersList`)
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
  };

  const handleUpdate = async (id) => {
    const res = await fetch(`${API_BASE_URL}/signup/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));

    setEditingUserId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(`${API_BASE_URL}/signup/${id}`, {
      method: "DELETE",
    });

    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const canEdit = currentUser?.role === "SUPERADMIN";

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-700 mb-4">Users List</h2>

      <input
        type="text"
        placeholder="Search..."
        className="mb-4 px-4 py-2 border rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

   <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Role</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users
              .filter(
                (u) =>
                  u.name.toLowerCase().includes(search.toLowerCase()) ||
                  u.email.toLowerCase().includes(search.toLowerCase())
              )
              .map((user, index) => (
                <tr key={user.id}>
                  <td className="border px-3 py-2">{index + 1}</td>

                  <td className="border px-3 py-2">
                    {editingUserId === user.id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    ) : (
                      user.name
                    )}
                  </td>

                  <td className="border px-3 py-2">{user.email}</td>

                  <td className="border px-3 py-2">
                    {editingUserId === user.id ? (
                      <select
                        className="border px-2 py-1 rounded w-full"
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPERADMIN">SUPERADMIN</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>

                  <td className="border px-3 py-2 text-center">
                   
                      <div className="flex justify-center gap-2">
                        {editingUserId === user.id ? (
                          <button
                            onClick={() => handleUpdate(user.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(user)}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
