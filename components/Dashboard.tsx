
import React, { useMemo } from 'react';
import { UserProfile, WaterLog, Achievement } from '../types';

interface DashboardProps {
  profile: UserProfile;
  logs: WaterLog[];
  onAddWater: (amount: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, logs, onAddWater }) => {
  const isDark = profile.darkModeEnabled;
  const todayDateStr = new Date().toDateString();
  
  const { percentage, streak, achievements, leftToReach } = useMemo(() => {
    const todayLogs = logs.filter(log => new Date(log.timestamp).toDateString() === todayDateStr);
    const intake = todayLogs.reduce((acc, curr) => acc + curr.amount, 0);
    const pct = Math.min(Math.round((intake / profile.dailyGoal) * 100), 100);

    const logsByDay: Record<string, number> = {};
    logs.forEach(log => {
      const d = new Date(log.timestamp).toDateString();
      logsByDay[d] = (logsByDay[d] || 0) + log.amount;
    });

    let currentStreak = 0;
    const todayMet = (logsByDay[todayDateStr] || 0) >= profile.dailyGoal;
    let tempDate = new Date();
    tempDate.setDate(tempDate.getDate() - 1);
    while (logsByDay[tempDate.toDateString()] >= profile.dailyGoal) {
      currentStreak++;
      tempDate.setDate(tempDate.getDate() - 1);
    }
    if (todayMet) currentStreak++;

    const daysMetCount = Object.values(logsByDay).filter(amt => amt >= profile.dailyGoal).length;
    const totalDrank = logs.reduce((acc, l) => acc + l.amount, 0);

    const achievementList: Achievement[] = [
      { id: 'first_sip', title: 'First Drop', description: 'Log your very first drink', icon: 'fa-droplet', unlocked: logs.length > 0 },
      { id: 'goal_getter', title: 'Goal Getter', description: 'Meet your daily goal for the first time', icon: 'fa-bullseye', unlocked: daysMetCount >= 1 },
      { id: 'streak_3', title: 'Consistent', description: 'Maintain a 3-day hydration streak', icon: 'fa-fire', unlocked: currentStreak >= 3 },
      { id: 'water_master', title: 'Water Master', description: 'Maintain a 7-day hydration streak', icon: 'fa-crown', unlocked: currentStreak >= 7 },
      { id: 'heavy_drinker', title: 'Aquatic', description: 'Drink a total of 10 liters', icon: 'fa-ocean', unlocked: totalDrank >= 10000 }
    ];

    return { 
      percentage: pct, 
      streak: currentStreak, 
      achievements: achievementList,
      leftToReach: Math.max(profile.dailyGoal - intake, 0)
    };
  }, [logs, profile.dailyGoal, todayDateStr]);

  const presets = [
    { amount: 150, color: 'bg-blue-400' },
    { amount: 200, color: 'bg-blue-500' },
    { amount: 250, color: 'bg-blue-600' },
  ];

  return (
    <div className="flex flex-col items-center animate-fadeIn gap-8 md:gap-12">
      {/* Top Stats Cards */}
      <div className="w-full flex justify-between items-center gap-3">
        <div className={`flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 px-4 py-4 rounded-3xl border transition-all ${isDark ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-100'}`}>
          <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <i className="fas fa-fire"></i>
          </div>
          <div className="text-center sm:text-left">
            <span className="block text-[9px] font-black text-orange-400 uppercase leading-none tracking-widest mb-1">Streak</span>
            <span className={`text-sm font-extrabold ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>{streak} Days</span>
          </div>
        </div>
        <div className={`flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 px-4 py-4 rounded-3xl border transition-all ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <i className="fas fa-award"></i>
          </div>
          <div className="text-center sm:text-left">
            <span className="block text-[9px] font-black text-blue-400 uppercase leading-none tracking-widest mb-1">Badges</span>
            <span className={`text-sm font-extrabold ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>{achievements.filter(a => a.unlocked).length}</span>
          </div>
        </div>
      </div>

      {/* Main Hydration Circle */}
      <div className="relative w-full flex flex-col items-center gap-8">
        <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-square">
          {/* Decorative Outer Ring */}
          <div className="absolute inset-0 border-4 border-dashed border-slate-100 rounded-full scale-[1.1] opacity-30 animate-[spin_30s_linear_infinite]"></div>
          
          {/* Main Circle Body */}
          <div className={`relative w-full h-full rounded-full border-8 overflow-hidden flex items-center justify-center transition-colors ${isDark ? 'bg-slate-800 border-slate-700 shadow-none' : 'bg-white border-white shadow-[0_32px_64px_-16px_rgba(59,130,246,0.15)]'}`}>
            
            {/* Liquid Fill */}
            <div 
              className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-1000 ease-out"
              style={{ height: `${percentage}%` }}
            >
              <div className="absolute -top-8 left-0 w-[200%] h-16 flex">
                 <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-blue-500 wave-effect opacity-70">
                    <path d="M0 10 C 25 20, 75 0, 100 10 L 100 20 L 0 20 Z" fill="currentColor"/>
                 </svg>
              </div>
            </div>

            {/* Percentage Display */}
            <div className="relative z-10 text-center select-none pointer-events-none px-4">
              <h1 className={`text-6xl sm:text-8xl font-black leading-none transition-colors duration-500 ${percentage > 50 ? 'text-white' : isDark ? 'text-blue-100' : 'text-blue-950'}`}>
                {percentage}%
              </h1>
              <p className={`text-sm sm:text-base font-black mt-2 uppercase tracking-[0.3em] ${percentage > 50 ? 'text-blue-100/80' : 'text-slate-400'}`}>
                Hydrated
              </p>
            </div>
          </div>
        </div>

        {/* Action Presets - Responsive Positioning */}
        <div className="flex flex-wrap justify-center gap-3 w-full">
          {presets.map((p) => (
            <button
              key={p.amount}
              onClick={() => onAddWater(p.amount)}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-blue-50 text-blue-950'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs ${p.color} shadow-sm`}>
                <i className="fas fa-plus"></i>
              </div>
              <span className="font-black text-sm">{p.amount}ml</span>
            </button>
          ))}
        </div>
      </div>

      {/* Goal Summary */}
      <div className="text-center space-y-1">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Goal Status</h4>
        <p className="text-lg sm:text-xl font-bold">
          <span className="text-blue-600 font-black">{leftToReach.toLocaleString()} ml</span>
          <span className="text-slate-500 font-medium text-base ml-1">remaining</span>
        </p>
      </div>

      {/* Achievement Slider */}
      <div className="w-full pt-4">
         <div className="flex items-center justify-between mb-6 px-1">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unlocked Badges</h4>
            <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">Show All</span>
         </div>
         <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar -mx-2 px-2 scroll-smooth">
            {achievements.filter(a => a.unlocked).map(a => (
              <div key={a.id} className="flex-shrink-0 flex flex-col items-center gap-3 w-20 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100 relative overflow-hidden transition-all group-hover:scale-110 group-active:scale-90">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                   <i className={`fas ${a.icon} text-2xl sm:text-3xl relative z-10`}></i>
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase text-center leading-tight tracking-wider">{a.title}</span>
              </div>
            ))}
            {achievements.filter(a => a.unlocked).length === 0 && (
              <div className={`w-full py-10 px-6 rounded-3xl border-2 border-dashed flex items-center justify-center gap-4 ${isDark ? 'border-slate-800 bg-slate-800/20' : 'border-slate-100 bg-slate-50/50'}`}>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <i className="fas fa-lock text-sm"></i>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-bold">Drink water to earn your first badge!</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
