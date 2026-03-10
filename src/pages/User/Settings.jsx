import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Shield, Eye, Lock, ArrowLeft, ToggleRight, ToggleLeft } from "lucide-react";
import { motion } from "framer-motion";

function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: false,
    twoFactor: false,
    privacyMode: false,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const settingsSections = [
    {
      title: "Notifications",
      icon: Bell,
      color: "from-blue-500 to-blue-600",
      items: [
        {
          key: "emailNotifications",
          label: "Email Notifications",
          description: "Receive updates via email",
        },
        {
          key: "smsNotifications",
          label: "SMS Notifications",
          description: "Receive updates via SMS",
        },
        {
          key: "orderUpdates",
          label: "Order Updates",
          description: "Get notified about order status",
        },
        {
          key: "promotions",
          label: "Promotional Emails",
          description: "Receive special offers and discounts",
        },
      ],
    },
    {
      title: "Security",
      icon: Shield,
      color: "from-green-500 to-green-600",
      items: [
        {
          key: "twoFactor",
          label: "Two-Factor Authentication",
          description: "Add an extra layer of security",
        },
        {
          key: "privacyMode",
          label: "Privacy Mode",
          description: "Hide your profile from other users",
        },
      ],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-12 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
          <h1 className="font-primary text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and security</p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;
            return (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`bg-gradient-to-br ${section.color} p-2 rounded-lg`}>
                    <SectionIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>

                {/* Section Items */}
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                      className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-2xl p-6 hover:border-amber-500/50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{item.label}</h3>
                          <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggle(item.key)}
                          className="relative"
                        >
                          {settings[item.key] ? (
                            <ToggleRight className="w-8 h-8 text-amber-500" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-gray-500" />
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-4"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 hover:border-amber-500/50 rounded-2xl p-6 text-left transition group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                <h3 className="text-white font-semibold">Change Password</h3>
              </div>
              <p className="text-gray-400 text-sm">Update your secure password</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 hover:border-amber-500/50 rounded-2xl p-6 text-left transition group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                <h3 className="text-white font-semibold">Login Activity</h3>
              </div>
              <p className="text-gray-400 text-sm">View your recent login history</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Settings;
