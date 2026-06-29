'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
              <img src="/logo.svg" alt="GestPlay Logo" width={32} height={32} />
              GestPlay
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="text-sm text-slate-300 hover:text-white transition">About</Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {user?.username}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
