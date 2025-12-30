
import React, { useState, useEffect } from 'react';
import { UserProfile, WaterLog, HydrationInsight } from '../types';
import { getHydrationAdvice } from '../services/geminiService';
import { playSound } from '../App';

const CLICK_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

interface CoachProps {
  profile: UserProfile;
  logs: WaterLog[];
}

const Coach: React.FC<CoachProps> = ({ profile, logs }) => {
  const [insight, setInsight] = useState<HydrationInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const isDark = profile.darkModeEnabled;

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const data = await getHydrationAdvice(profile, logs);
      setInsight(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  const handleRefresh = () => {
    playSound(CLICK_SOUND);
    fetchAdvice();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return isDark ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'good': return isDark ? 'bg-blue-900/40 text-blue-300 border-blue-800' : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'average': return isDark ? 'bg-amber-900/40 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-700 border-amber-200';
      case 'dehydrated': return isDark ? 'bg-rose-900/40 text-rose-300 border-rose-800' : 'bg-rose-100 text-rose-700 border-rose-200';
      default: return isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <i className="fas fa-robot text-blue-500"></i>
          Gemini AI Coach
        </h2>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className={`p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 ${isDark ? 'hover:bg-slate-800' : ''}`}
        >
          <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
        </button>
      </div>

      {loading ? (
        <div className={`glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
          <div className="animate-bounce">
            <i className="fas fa-brain text-blue-500 text-4xl"></i>
          </div>
          <p className="text-gray-500 animate-pulse">Analyzing your hydration patterns...</p>
        </div>
      ) : insight ? (
        <div className="flex flex-col gap-4">
          <div className={`border p-4 rounded-xl flex items-center gap-3 transition-colors ${getStatusColor(insight.status)}`}>
            <i className="fas fa-info-circle"></i>
            <span className="font-semibold uppercase text-xs tracking-wider">Status: {insight.status}</span>
          </div>

          <div className={`glass-card rounded-2xl p-6 shadow-md border-l-4 border-l-blue-500 transition-colors ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-white text-gray-800'}`}>
            <h3 className={`text-lg font-bold mb-2 italic ${isDark ? 'text-blue-100' : 'text-gray-800'}`}>"{insight.message}"</h3>
            <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} leading-relaxed`}>
              {insight.advice}
            </p>
          </div>

          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-50'} rounded-2xl p-6 shadow-sm border transition-colors`}>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Daily Statistics</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={isDark ? 'text-slate-300' : 'text-gray-600'}>Health Goal</span>
                <span className={`font-medium ${isDark ? 'text-white' : ''}`}>{profile.dailyGoal}ml</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-slate-700' : 'bg-gray-100'} h-2 rounded-full overflow-hidden`}>
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Based on your weight of {profile.weight}kg, the optimal intake is {Math.round(profile.weight * 33)}ml.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">
          No insights available yet. Add some water logs to get started!
        </div>
      )}
    </div>
  );
};

export default Coach;
