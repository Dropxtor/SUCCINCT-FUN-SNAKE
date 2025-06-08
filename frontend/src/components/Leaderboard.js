import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Leaderboard = ({ currentScore, walletAddress }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (currentScore && walletAddress) {
      submitScore();
    }
  }, [currentScore, walletAddress]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API}/leaderboard`);
      setScores(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const submitScore = async () => {
    try {
      await axios.post(`${API}/score`, {
        walletAddress,
        score: currentScore,
        timestamp: Date.now()
      });
      fetchLeaderboard(); // Refresh leaderboard after submitting
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Find user's rank
  useEffect(() => {
    if (walletAddress && scores.length > 0) {
      const rank = scores.findIndex(score => score.walletAddress === walletAddress) + 1;
      setUserRank(rank > 0 ? rank : null);
    }
  }, [scores, walletAddress]);

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-purple-900 to-black p-6 rounded-lg border border-cyan-400">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">LEADERBOARD</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-purple-900 to-black p-6 rounded-lg border border-cyan-400">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
        🏆 LEADERBOARD 🏆
      </h2>
      
      {userRank && (
        <div className="mb-4 p-3 bg-gradient-to-r from-yellow-900 to-yellow-800 rounded-lg border border-yellow-400">
          <div className="text-center text-yellow-400 font-bold">
            Your Rank: #{userRank}
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {scores.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No scores yet!</p>
            <p className="text-sm">Be the first to play and set a high score!</p>
          </div>
        ) : (
          scores.map((scoreEntry, index) => (
            <div 
              key={`${scoreEntry.walletAddress}-${scoreEntry.timestamp}`}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                scoreEntry.walletAddress === walletAddress 
                  ? 'bg-gradient-to-r from-cyan-900 to-purple-900 border-cyan-400' 
                  : 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-orange-600 text-white' :
                  'bg-gray-700 text-white'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="text-white font-mono">
                    {formatAddress(scoreEntry.walletAddress)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTime(scoreEntry.timestamp)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold text-lg ${
                  index === 0 ? 'text-yellow-400' :
                  index === 1 ? 'text-gray-300' :
                  index === 2 ? 'text-orange-400' :
                  'text-white'
                }`}>
                  {scoreEntry.score}
                </div>
                <div className="text-xs text-gray-400">points</div>
              </div>
            </div>
          ))
        )}
      </div>

      {scores.length > 5 && (
        <div className="mt-4 text-center text-gray-400 text-sm">
          Showing top {Math.min(scores.length, 10)} players
        </div>
      )}
    </div>
  );
};

export default Leaderboard;