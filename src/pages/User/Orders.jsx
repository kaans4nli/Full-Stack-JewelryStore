import { useEffect, useState } from "react";
import { getOrders } from "../../api/orderApi";
import { ArrowLeft, Package, Calendar, DollarSign, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const statusColors = {
  PENDING: { bg: "bg-yellow-500/20", border: "border-yellow-500/50", text: "text-yellow-400" },
  PROCESSING: { bg: "bg-blue-500/20", border: "border-blue-500/50", text: "text-blue-400" },
  SHIPPED: { bg: "bg-purple-500/20", border: "border-purple-500/50", text: "text-purple-400" },
  DELIVERED: { bg: "bg-green-500/20", border: "border-green-500/50", text: "text-green-400" },
  CANCELLED: { bg: "bg-red-500/20", border: "border-red-500/50", text: "text-red-400" },
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      setOrders(res);
    } catch (err) {
      console.error("Siparişler yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-pulse">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

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
          <h1 className="font-primary text-4xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-gray-400">Track your orders and view order details</p>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Package className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg">You haven't placed any orders yet.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusConfig = statusColors[order.status] || statusColors.PENDING;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-2xl p-6 hover:border-amber-500/50 transition"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-white text-lg">Order #{order.id}</h3>
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4 text-amber-400" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Truck className="w-4 h-4 text-amber-400" />
                          Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-amber-400" />
                        <span className="text-2xl font-bold text-white">{order.totalAmount}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{order.items?.length || 0} items</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;