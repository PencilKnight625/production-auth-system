import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setSubmitting(true);

    try {
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      const userPath = `users/${user.uid}`;
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userPath);
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg flex items-center justify-center p-6 md:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full max-w-6xl">
        {/* Left Side: Theme Intro */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
          <div>
            <span className="text-natural-primary font-semibold tracking-widest text-xs uppercase mb-3 block">Secure Connection</span>
            <h1 className="text-6xl font-serif text-natural-secondary leading-tight mb-6 italic">Secure Entry</h1>
            <p className="text-xl text-natural-muted leading-relaxed max-w-lg">
              A robust, full-stack authentication gateway built for privacy and performance. Seamlessly integrated with Firebase.
            </p>
          </div>

          <div className="bg-white/40 p-8 rounded-[32px] border border-natural-border space-y-5 backdrop-blur-sm">
            <h3 className="font-serif italic text-2xl text-natural-secondary">Platform Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm py-3 border-b border-natural-border">
                <span className="opacity-60 font-medium uppercase tracking-wider text-[10px]">Security Protocol</span>
                <span className="bg-natural-primary text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-tighter">Hardened</span>
              </div>
              <div className="flex items-center justify-between text-sm py-3 border-b border-natural-border">
                <span className="opacity-60 font-medium uppercase tracking-wider text-[10px]">Identity Layer</span>
                <span className="font-semibold text-natural-secondary">Firebase Auth</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md p-10 rounded-[40px] shadow-2xl shadow-natural-primary/5 relative overflow-hidden ring-1 ring-natural-border"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-natural-primary"></div>
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-serif italic text-natural-secondary">Create Account</h2>
              <p className="text-natural-muted text-sm mt-3">Join our secure community today.</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50/50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-xs font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-natural-primary font-bold mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-primary/40" />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-natural-input border border-natural-border focus:outline-none focus:ring-2 focus:ring-natural-primary/20 transition-all text-sm font-medium"
                    placeholder="Julianna Reeves"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-natural-primary font-bold mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-primary/40" />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-natural-input border border-natural-border focus:outline-none focus:ring-2 focus:ring-natural-primary/20 transition-all text-sm font-medium"
                    placeholder="hello@julianna.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-natural-primary font-bold mb-2 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-primary/40" />
                    <input
                      type="password"
                      required
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-natural-input border border-natural-border focus:outline-none focus:ring-2 focus:ring-natural-primary/20 transition-all text-sm font-medium"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-natural-primary font-bold mb-2 ml-1">Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-primary/40" />
                    <input
                      type="password"
                      required
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-natural-input border border-natural-border focus:outline-none focus:ring-2 focus:ring-natural-primary/20 transition-all text-sm font-medium"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-natural-primary hover:bg-[#4a4a35] text-white font-bold py-4 rounded-2xl shadow-lg shadow-natural-primary/20 flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-xs">Register Account</span>
                    <UserPlus className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-natural-border text-center">
              <p className="text-sm text-natural-muted font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-natural-primary font-bold hover:underline underline-offset-8 transition-all">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
