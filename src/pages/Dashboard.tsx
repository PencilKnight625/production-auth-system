import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { LogOut, User, Mail, Calendar, LayoutDashboard, Loader2 } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  createdAt: any;
}

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;

      const userPath = `users/${currentUser.uid}`;
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, userPath);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-natural-bg">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-natural-border px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-natural-primary rounded-xl flex items-center justify-center text-white">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <span className="text-2xl font-serif italic text-natural-secondary">EarthyAuth</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-natural-bg hover:bg-natural-border text-natural-primary font-bold py-2.5 px-5 rounded-xl border border-natural-border transition-all active:scale-95 text-xs uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>

      <main className="max-w-5xl mx-auto p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] shadow-2xl shadow-natural-primary/5 overflow-hidden ring-1 ring-natural-border"
        >
          <div className="bg-natural-primary h-48 relative">
            <div className="absolute -bottom-16 left-16 w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center border-8 border-natural-bg ring-1 ring-natural-border">
              <User className="text-natural-primary w-16 h-16" />
            </div>
            <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 text-white text-[10px] uppercase font-bold tracking-widest">
              Verified Session
            </div>
          </div>

          <div className="pt-24 pb-16 px-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-natural-border">
              <div>
                <span className="text-natural-primary font-bold tracking-widest text-[10px] uppercase mb-4 block">Profile Overview</span>
                <h1 className="text-5xl lg:text-6xl font-serif text-natural-secondary leading-tight italic">
                  Greetings, {profile?.name || 'Explorer'}
                </h1>
              </div>
              <div className="flex items-center gap-4 text-natural-muted font-medium text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Account Status: Active
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-8 bg-natural-input rounded-[32px] border border-natural-border group hover:border-natural-primary/30 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-white rounded-2xl text-natural-primary shadow-sm ring-1 ring-natural-border">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-[11px] uppercase tracking-wider text-natural-primary font-bold">Email Identity</h3>
                    <p className="text-natural-muted text-xs">Primary contact address</p>
                  </div>
                </div>
                <p className="text-natural-secondary text-xl font-medium">{profile?.email || currentUser?.email}</p>
              </div>

              <div className="p-8 bg-natural-input rounded-[32px] border border-natural-border group hover:border-natural-primary/30 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-white rounded-2xl text-natural-primary shadow-sm ring-1 ring-natural-border">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-[11px] uppercase tracking-wider text-natural-primary font-bold">Member Since</h3>
                    <p className="text-natural-muted text-xs">Registration date</p>
                  </div>
                </div>
                <p className="text-natural-secondary text-xl font-medium">
                  {profile?.createdAt?.toDate
                    ? profile.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'Awaiting sync...'}
                </p>
              </div>
            </div>

            <div className="mt-12 p-10 bg-natural-secondary rounded-[40px] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
              <div className="relative z-0">
                <h3 className="text-3xl font-serif italic mb-4">Core Infrastructure</h3>
                <p className="text-white/70 leading-relaxed max-w-2xl text-lg">
                  Every interaction within this environment is secured by modern relational mapping and cryptographic verification. Your profile data is housed in isolated Firestore shards, ensuring maximum privacy and rapid access.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
