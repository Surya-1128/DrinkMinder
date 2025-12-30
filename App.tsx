
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TabType, UserProfile, WaterLog, ReminderType } from './types';
import { STORAGE_KEYS, DEFAULT_PROFILE } from './constants';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Settings from './components/Settings';
import Coach from './components/Coach';

// Sound utilities
const SOUNDS = {
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  WATER: 'https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3',
};

export const playSound = (url: string) => {
  const audio = new Audio(url);
  audio.volume = 0.4;
  audio.play().catch(e => console.debug('Sound play blocked:', e));
};

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DASHBOARD);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const lastReminderRef = useRef<number>(Date.now());

  useEffect(() => {
    const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
    const hasOnboarded = localStorage.getItem('onboarded');
    
    if (storedProfile) setProfile(JSON.parse(storedProfile));
    if (storedLogs) setLogs(JSON.parse(storedLogs));
    if (hasOnboarded) setShowOnboarding(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }, [logs]);

  const handleStart = () => {
    playSound(SOUNDS.CLICK);
    localStorage.setItem('onboarded', 'true');
    setShowOnboarding(false);
  };

  const handleAddWater = useCallback((amount: number) => {
    const newLog: WaterLog = {
      id: Date.now().toString(),
      amount,
      timestamp: Date.now()
    };
    setLogs(prev => [...prev, newLog]);
    lastReminderRef.current = Date.now();
    playSound(SOUNDS.WATER);
  }, []);

  const handleDeleteLog = (id: string) => {
    playSound(SOUNDS.CLICK);
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white p-6 animate-fadeIn">
        <div className="max-w-md w-full flex flex-col items-center">
          <div className="float-animation mb-8 relative">
             <div className="w-40 h-40 bg-blue-100 rounded-full absolute -top-4 -left-4 blur-3xl opacity-50"></div>
             <img 
              src="https://cdn-icons-png.flaticon.com/512/3100/3100566.png" 
              alt="Water Drop" 
              className="w-40 h-40 relative z-10"
             />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-4 leading-tight">
            Reminds you to <br className="hidden sm:block"/> drink regularly
          </h1>
          <p className="text-slate-400 text-center mb-10 text-base md:text-lg">
            Manage your health by drinking regularly <br className="hidden sm:block"/> and setting smart reminders.
          </p>
          <button 
            onClick={handleStart}
            className="w-full bg-blue-600 text-white py-5 rounded-3xl text-lg font-bold shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95"
          >
            Get Started <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case TabType.DASHBOARD:
        return <Dashboard profile={profile} logs={logs} onAddWater={handleAddWater} />;
      case TabType.COACH:
        return <Coach profile={profile} logs={logs} />;
      case TabType.HISTORY:
        return <History logs={logs} onDeleteLog={handleDeleteLog} profile={profile} />;
      case TabType.SETTINGS:
        return <Settings profile={profile} onUpdateProfile={(p) => setProfile(p)} />;
      default:
        return <Dashboard profile={profile} logs={logs} onAddWater={handleAddWater} />;
    }
  };

  return (
    <div className={`min-h-screen w-full flex justify-center transition-colors duration-300 ${profile.darkModeEnabled ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className={`w-full max-w-xl flex flex-col relative min-h-screen ${profile.darkModeEnabled ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} sm:shadow-2xl sm:shadow-slate-200/50`}>
        <header className="px-6 sm:px-10 pt-8 pb-4 flex items-center justify-between sticky top-0 z-[60] backdrop-blur-md bg-inherit/80">
          <div className="flex items-center gap-4">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed || profile.name}`} 
              className="w-11 h-11 rounded-2xl bg-blue-100 border-2 border-white shadow-sm object-cover"
              alt="Avatar"
            />
            <div className="overflow-hidden">
              <h2 className="text-base font-bold leading-tight truncate">Hi, {profile.name}!</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stay Hydrated</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab(TabType.SETTINGS)} 
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${profile.darkModeEnabled ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}
          >
            <i className="fas fa-cog"></i>
          </button>
        </header>

        <main className="flex-1 px-6 sm:px-10 pt-4 pb-36 overflow-y-auto no-scrollbar">
          {renderContent()}
        </main>

        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg glass-card rounded-[2.5rem] p-2 flex justify-between items-center z-[100] transition-colors border shadow-2xl">
          <NavButton active={activeTab === TabType.DASHBOARD} onClick={() => setActiveTab(TabType.DASHBOARD)} icon="fa-house" label="Home" isDark={profile.darkModeEnabled} />
          <NavButton active={activeTab === TabType.HISTORY} onClick={() => setActiveTab(TabType.HISTORY)} icon="fa-chart-pie" label="Stats" isDark={profile.darkModeEnabled} />
          <NavButton active={activeTab === TabType.COACH} onClick={() => setActiveTab(TabType.COACH)} icon="fa-wand-magic-sparkles" label="AI Coach" isDark={profile.darkModeEnabled} />
          <NavButton active={activeTab === TabType.SETTINGS} onClick={() => setActiveTab(TabType.SETTINGS)} icon="fa-user-gear" label="Profile" isDark={profile.darkModeEnabled} />
        </nav>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, isDark }: { active: boolean; onClick: () => void; icon: string; label: string; isDark: boolean }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center gap-1 py-3 px-1 rounded-[2rem] transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : isDark ? 'text-slate-500' : 'text-slate-400'}`}
  >
    <i className={`fas ${icon} text-lg`}></i>
    <span className={`text-[8px] font-black uppercase tracking-tighter ${active ? 'block' : 'hidden'}`}>{label}</span>
  </button>
);

export default App;
