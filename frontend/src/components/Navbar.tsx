'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Menu, X, Play } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-80 transition-opacity">
              <img src="/logo.svg" alt="GestPlay Logo" width={32} height={32} />
              GestPlay
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/play" className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5">
              <Play className="w-4 h-4" />
              Play
            </Link>
            <Link href="/about" className="text-sm text-slate-300 hover:text-white transition-colors">
              About
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-6 border-l border-white/10 pl-6 ml-2">
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
              </div>
            ) : (
              <div className="flex items-center space-x-4 border-l border-white/10 pl-6 ml-2">
                <Link
                  href="/auth"
                  className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl overflow-hidden shadow-2xl"
          >
            <div className="px-4 pt-4 pb-6 space-y-4 flex flex-col">
              <Link 
                href="/play" 
                onClick={closeMobileMenu}
                className="flex items-center gap-2 text-base font-medium text-cyan-400 hover:text-cyan-300 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Play className="w-5 h-5" />
                Play Now
              </Link>
              <Link 
                href="/about" 
                onClick={closeMobileMenu}
                className="block text-base font-medium text-slate-300 hover:text-white p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                About
              </Link>
              
              <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      onClick={closeMobileMenu}
                      className="flex items-center text-base font-medium text-gray-300 hover:text-white p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <UserIcon className="w-5 h-5 mr-3" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="flex items-center text-base font-medium text-gray-400 hover:text-red-400 p-3 rounded-lg hover:bg-red-500/10 transition-colors w-full text-left"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    onClick={closeMobileMenu}
                    className="block text-center w-full px-5 py-3 rounded-xl text-base font-medium text-white bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 border border-white/10 transition-all mt-2"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
