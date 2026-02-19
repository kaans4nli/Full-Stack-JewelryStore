import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await handleLogin(username, password);
    } catch (err) {
      setError("Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 pt-8">
      {/* Yukarıdaki satır: h-screen yerine min-h hesaplandı
          Navbar 4rem (yaklaşık 64px) yer kaplıyor, onu düşürdük. */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-blue-500 text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div>
          <label htmlFor="username" className="label-field">
            Username
          </label>
          <div className="mt-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="label-field">
            Password
          </label>
          <div className="mt-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white p-2 rounded ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
