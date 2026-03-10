import { useEffect, useState } from "react";
import { getAllUsers, deleteUserById } from "../api/adminUserApi";
import { useNavigate } from "react-router-dom";

export default function AdminUserList() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers({ keyword, page, size });
            setUsers(data?.content || []);  // undefined ise boş dizi
            setTotalPages(data?.totalPages || 0);
        } catch (err) {
            console.error("Kullanıcılar alınırken hata oluştu:", err);
            setUsers([]); // garanti
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, keyword]);

    const handleDelete = async (id) => {
        if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
        await deleteUserById(id);
        fetchUsers();
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-black">Kullanıcı Yönetimi</h2>

            {/* Arama + Yeni Kullanıcı */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Ara..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="border px-2 py-1 text-black"
                />
                <button
                    onClick={() => setPage(0)}
                    className="bg-blue-500 text-white px-3 rounded"
                >
                    Ara
                </button>

                <button
                    onClick={() => navigate("/admin/users/new")}
                    className="bg-green-500 text-white px-3 rounded"
                >
                    Yeni Kullanıcı
                </button>
            </div>

            {loading ? (
                <p>Yükleniyor...</p>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-3 py-1 text-black">ID</th>
                            <th className="border px-3 py-1 text-black">Kullanıcı Adı</th>
                            <th className="border px-3 py-1 text-black">Email</th>
                            <th className="border px-3 py-1 text-black">Rol</th>
                            <th className="border px-3 py-1 text-black">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td className="border px-3 py-1 text-black">{u.id}</td>
                                <td className="border px-3 py-1 text-black">{u.username}</td>
                                <td className="border px-3 py-1 text-black">{u.email}</td>
                                <td className="border px-3 py-1 text-black">{u.role}</td>
                                <td className="border px-3 py-1 flex gap-2">
                                    <button
                                        onClick={() => navigate(`/admin/users/${u.id}`)}
                                        className="bg-yellow-500 text-white px-2 rounded"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        className="bg-red-500 text-white px-2 rounded"
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Sayfalama */}
            <div className="flex gap-2 mt-4 text-black">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="bg-gray-300 px-2 rounded disabled:opacity-50"
                >
                    Önceki
                </button>

                <span>Sayfa {page + 1} / {totalPages}</span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="bg-gray-300 px-2 rounded disabled:opacity-50"
                >
                    Sonraki
                </button>
            </div>
        </div>
    );
}
