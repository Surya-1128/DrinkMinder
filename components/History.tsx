
import React, { useState } from 'react';
import { WaterLog, UserProfile } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HistoryProps {
  logs: WaterLog[];
  onDeleteLog: (id: string) => void;
  profile: UserProfile;
}

const History: React.FC<HistoryProps> = ({ logs, onDeleteLog, profile }) => {
  const isDark = profile?.darkModeEnabled;
  const [activeActivity, setActiveActivity] = useState('Water');

  const activities = [
    { name: 'Water', icon: 'fa-droplet' },
    { name: 'Jogging', icon: 'fa-person-running' },
    { name: 'Eat', icon: 'fa-utensils' },
    { name: 'Sleep', icon: 'fa-moon' },
  ];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toDateString();
  });

  const chartData = last7Days.map(dateStr => {
    const dailyTotal = logs
      .filter(log => new Date(log.timestamp).toDateString() === dateStr)
      .reduce((sum, log) => sum + log.amount, 0);
    
    return {
      name: new Date(dateStr).toLocaleDateString([], { weekday: 'short' }),
      amount: dailyTotal,
    };
  });

  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn pb-32">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-black">Your Statistic</h2>
         <button className="text-slate-400"><i className="fas fa-ellipsis-vertical text-lg"></i></button>
      </div>

      {/* Premium Banner */}
      <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200 flex items-center justify-between">
        <div className="relative z-10 max-w-[60%]">
          <h3 className="text-2xl font-black mb-1">Get Premium Features</h3>
          <p className="text-blue-100 text-sm font-bold opacity-80">Only at $3/month</p>
        </div>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3100/3100566.png" 
          className="w-20 h-20 opacity-40 absolute -right-4 -bottom-4 rotate-12"
          alt="Water Drop"
        />
        <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center relative z-10 text-white border-4 border-blue-500 shadow-xl">
           <i className="fas fa-star text-2xl"></i>
        </div>
      </div>

      {/* Activity Chips */}
      <div className="grid grid-cols-4 gap-3">
        {activities.map((act) => (
          <button
            key={act.name}
            onClick={() => setActiveActivity(act.name)}
            className={`flex flex-col items-center gap-3 p-4 rounded-[2rem] transition-all border ${
              activeActivity === act.name 
                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' 
                : isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-white text-slate-400 shadow-sm'
            }`}
          >
            <i className={`fas ${act.icon} text-xl`}></i>
            <span className="text-[10px] font-black uppercase tracking-widest">{act.name}</span>
          </button>
        ))}
      </div>

      {/* Statistics Chart */}
      <div className={`rounded-[3rem] p-8 shadow-sm border transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-white shadow-2xl shadow-slate-100/50'}`}>
        <div className="flex justify-between items-center mb-8">
           <h4 className="font-black text-slate-800 text-lg">Weekly Overview</h4>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
              />
              <Tooltip 
                cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                contentStyle={{ 
                  borderRadius: '20px', 
                  border: 'none', 
                  backgroundColor: isDark ? '#1e293b' : '#fff', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '12px 16px'
                }}
                itemStyle={{ color: '#3b82f6', fontWeight: 800, fontSize: '14px' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#3b82f6" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorAmt)" 
                animationDuration={2000}
                dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 3 }}
                activeDot={{ r: 8, fill: '#3b82f6', stroke: '#fff', strokeWidth: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Log / Delete Stats */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-black px-2">Recent Logs</h3>
        <div className="flex flex-col gap-3">
          {sortedLogs.slice(0, 15).map((log) => (
            <div key={log.id} className={`p-5 rounded-[2.5rem] flex items-center justify-between border transition-all animate-fadeIn ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50 shadow-sm'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-lg">
                  <i className="fas fa-droplet"></i>
                </div>
                <div>
                  <h4 className="font-bold text-lg">{log.amount} ml</h4>
                  <p className="text-slate-400 text-xs font-medium">
                    {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onDeleteLog(log.id)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors active:scale-90"
                title="Remove entry"
              >
                <i className="fas fa-trash-can text-sm"></i>
              </button>
            </div>
          ))}
          {sortedLogs.length === 0 && (
            <div className="text-center py-10 opacity-30">
              <i className="fas fa-list-check text-4xl mb-3"></i>
              <p className="font-bold">No history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
