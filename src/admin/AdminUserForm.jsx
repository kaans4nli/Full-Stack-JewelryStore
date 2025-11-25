import { useState, useEffect } from "react";
import {
  createUser,
  updateUser,
  getUserById,
} from "../api/adminUserApi";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminUserForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  useEffect(() => {
    if (id) {
      getUserById(id).then((data) => {
        setUsername(data.username);
        setEmail(data.email);
        setRole(data.role);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { username, email, role };

    // Şifre sadece yeni kullanıcıda zorunlu olsun
    if (!id) userData.password = password;
    else if (password.trim() !== "") userData.password = password;

    if (id) await updateUser(id, userData);
    else await createUser(userData);

    navigate("/admin/users");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">
        {id ? "Kullanıcı Düzenle" : "Yeni Kullanıcı"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Username */}
        <label className="label-field">Kullanıcı Adı</label>
        <input
          className="border px-2 py-1 w-full text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Email */}
        <label className="label-field">Email</label>
        <input
          type="email"
          className="border px-2 py-1 w-full text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <label className="label-field">
          Şifre {id ? "(boş bırakırsan değişmez)" : ""}
        </label>
        <input
          type="password"
          className="border px-2 py-1 w-full text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={id ? "Mevcut şifreyi değiştirmek için yaz" : ""}
        />

        {/* Role */}
        <label className="label-field">Rol</label>
        <select
          className="border px-2 py-1 w-full text-black"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button type="button" onClick={() => navigate("/admin/users")}>
            İptal
          </button>

          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
