'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Trophy, Swords, Target, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:4000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoadingData(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (isLoading || loadingData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileData) return null;

  const { user: stats, matchHistory } = profileData;

  const getMatchResult = (match: any) => {
    if (!match.winner) return { label: 'Draw/Ongoing', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' };
    if (match.winner.id === user?.id) return { label: 'Victory', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' };
    return { label: 'Defeat', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' };
  };

  const getOpponent = (match: any) => {
    if (match.player1Id === user?.id) {
      return match.player2 ? match.player2.username : 'Waiting...';
    }
    return match.player1 ? match.player1.username : 'Waiting...';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Welcome, {user?.username}
        </h1>
        <p className="text-gray-400">Track your progress and review your past matches.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center space-x-4"
        >
          <div className="p-4 bg-blue-500/20 rounded-2xl">
            <Swords className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Games Played</p>
            <p className="text-3xl font-bold text-white">{stats.gamesPlayed}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center space-x-4"
        >
          <div className="p-4 bg-purple-500/20 rounded-2xl">
            <Target className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Win Rate</p>
            <p className="text-3xl font-bold text-white">{(stats.winRate * 100).toFixed(1)}%</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center space-x-4"
        >
          <div className="p-4 bg-green-500/20 rounded-2xl">
            <Trophy className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Total Wins</p>
            <p className="text-3xl font-bold text-white">
              {matchHistory.filter((m: any) => m.winner?.id === user?.id).length}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Match History */}
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
        <Calendar className="w-6 h-6 mr-3 text-blue-400" />
        Recent Matches
      </h2>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        {matchHistory.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p>You haven't played any matches yet.</p>
            <p className="mt-2 text-sm">Jump into a game to start tracking your stats!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300">Opponent</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300">Game Type</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300">Result</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {matchHistory.map((match: any, index: number) => {
                  const result = getMatchResult(match);
                  return (
                    <motion.tr 
                      key={match.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">
                        {getOpponent(match)}
                      </td>
                      <td className="px-6 py-4 text-gray-300 capitalize">
                        {match.gameType.toLowerCase()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${result.bg} ${result.color}`}>
                          {result.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(match.startTime).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
