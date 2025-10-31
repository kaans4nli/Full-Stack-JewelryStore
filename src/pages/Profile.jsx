import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user, loading, handleLogout } = useContext(AuthContext);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!user) return null; // AuthContext yönlendirmeyi zaten handle ediyor

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96 text-center">
        <h2 className="text-black text-2xl font-bold mb-4">Profile</h2>
        <p className="text-black mb-2"><strong>Username:</strong> {user.username}</p>
        <button
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
