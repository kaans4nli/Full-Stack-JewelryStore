import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, MapPin, ShoppingBag, Heart, Settings, LogOut, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";

function Profile() {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-pulse">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const quickLinks = [
    {
      icon: MapPin,
      title: "Addresses",
      description: "Manage delivery addresses",
      onClick: () => navigate("/addresses"),
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: ShoppingBag,
      title: "Orders",
      description: "View your order history",
      onClick: () => navigate("/orders"),
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Heart,
      title: "Favorites",
      description: "Your wishlist items",
      onClick: () => navigate("/favorites"),
      color: "from-rose-500 to-rose-600",
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Account settings",
      onClick: () => navigate("/settings"),
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-rose-500/20 rounded-3xl blur-2xl"></div>
            
            {/* Profile Card */}
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                    <User className="w-12 h-12 text-slate-900" />
                  </div>
                  
                  {/* User Info */}
                  <div className="text-white">
                    <h1 className="font-primary text-4xl font-bold mb-2">{user.username}</h1>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-amber-400" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span className="text-sm">Member since {new Date().getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 px-6 py-3 rounded-xl flex items-center gap-2 transition font-secondary"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, translateY: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={link.onClick}
                className="cursor-pointer group relative overflow-hidden rounded-2xl"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-100 transition duration-300`}></div>
                
                {/* Card Content */}
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 group-hover:border-transparent p-6 rounded-2xl transition">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-white transition">
                    {link.title}
                  </h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-200 transition">
                    {link.description}
                  </p>
                  <div className="mt-4 flex items-center opacity-0 group-hover:opacity-100 transition">
                    <span className="text-amber-400 text-sm font-medium">Explore →</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Profile;
