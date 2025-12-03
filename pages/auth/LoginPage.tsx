import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Mail, Lock, ArrowRight, BookOpen, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for Login
  const [loginError, setLoginError] = useState('');
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  // State for Forgot Password
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to where they came from or app home
  const from = (location.state as any)?.from?.pathname || '/app';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoginSubmitting(true);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setLoginError(err.message || 'Failed to login');
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setIsResetSubmitting(true);

    try {
      await authService.resetPassword(email);
      setResetSuccess('Password reset link sent! Please check your email.');
    } catch (err: any) {
      setResetError(err.message || 'Failed to send reset link');
    } finally {
      setIsResetSubmitting(false);
    }
  };

  const toggleMode = (newMode: 'login' | 'forgot') => {
    setMode(newMode);
    setLoginError('');
    setResetError('');
    setResetSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-digri-500 to-digri-700 p-8 text-center relative overflow-hidden transition-all duration-500">
           <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
           <div className="relative z-10">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-inner border border-white/20">
               <BookOpen size={32} />
             </div>
             <h2 className="text-2xl font-bold text-white">
                {mode === 'login' ? 'Welcome Back' : 'Reset Password'}
             </h2>
             <p className="text-digri-100 text-sm">
                {mode === 'login' ? 'Sign in to continue your journey' : 'Enter your email to recover access'}
             </p>
           </div>
        </div>

        {/* Content */}
        <div className="p-8">
          
          {/* LOGIN FORM */}
          {mode === 'login' && (
            <>
              {loginError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-sm animate-in slide-in-from-top-2">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-digri-500/50 transition-all font-medium text-slate-700"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-digri-500/50 transition-all font-medium text-slate-700"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                   <label className="flex items-center gap-2 cursor-pointer">
                     <input type="checkbox" className="rounded text-digri-600 focus:ring-digri-500" />
                     <span className="text-slate-500">Remember me</span>
                   </label>
                   <button 
                     type="button"
                     onClick={() => toggleMode('forgot')} 
                     className="text-digri-600 font-bold hover:underline"
                   >
                     Forgot Password?
                   </button>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoginSubmitting}
                  className="w-full py-4 bg-digri-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-digri-500/30 flex items-center justify-center gap-2 hover:bg-digri-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isLoginSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Sign In <ArrowRight size={20} /></>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-digri-600 font-bold hover:underline">
                  Create Account
                </Link>
              </div>
            </>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
             <>
               {resetError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-sm animate-in slide-in-from-top-2">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{resetError}</span>
                </div>
               )}
               
               {resetSuccess && (
                <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2 text-emerald-600 text-sm animate-in slide-in-from-top-2">
                  <CheckCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{resetSuccess}</span>
                </div>
               )}

               <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-digri-500/50 transition-all font-medium text-slate-700"
                      placeholder="you@example.com"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    We'll send a link to reset your password.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isResetSubmitting || !!resetSuccess}
                  className="w-full py-4 bg-digri-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-digri-500/30 flex items-center justify-center gap-2 hover:bg-digri-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isResetSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Send Reset Link <ArrowRight size={20} /></>
                  )}
                </button>
                
                <button 
                    type="button"
                    onClick={() => toggleMode('login')}
                    className="w-full py-2 text-slate-500 font-bold text-sm hover:text-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Login
                </button>
               </form>
             </>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;