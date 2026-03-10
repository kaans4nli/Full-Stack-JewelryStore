import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { handleRegister } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await handleRegister(username, email, password);
    } catch (err) {
      setError('Registration failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8 px-4">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-3xl blur-2xl opacity-30"></div>
          <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl p-12 shadow-2xl max-w-md">
            <h1 className="font-primary text-5xl font-bold text-slate-900 mb-4">Join Us</h1>
            <p className="text-lg text-slate-800 font-secondary">
              Create your account to explore our exclusive collection and enjoy special benefits.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-slate-800">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Exclusive Offers</span>
              </div>
              <div className="flex items-center gap-3 text-slate-800">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Wishlist Feature</span>
              </div>
              <div className="flex items-center gap-3 text-slate-800">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Order Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="font-primary text-4xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400 font-secondary">Join our jewelry community</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Username Field */}
          <div className="mb-6">
            <label className="block text-white font-secondary text-sm font-medium mb-3">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="joyjewelry"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-white font-secondary text-sm font-medium mb-3">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-white font-secondary text-sm font-medium mb-3">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block text-white font-secondary text-sm font-medium mb-3">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                required
              />
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 mb-6 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-600 bg-slate-700 cursor-pointer accent-amber-500"
              required
            />
            <span className="text-gray-400 font-secondary text-sm">
              I agree to the{' '}
              <a href="#" className="text-amber-400 hover:text-amber-300">
                Terms of Service
              </a>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium font-secondary flex items-center justify-center gap-2 transition ${
              loading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-amber-500/30"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-amber-400 rounded-full animate-spin"></div>
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-gray-400 font-secondary text-sm mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-amber-400 hover:text-amber-300 font-medium transition"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
