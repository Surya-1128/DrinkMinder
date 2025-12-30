
import React, { useState } from 'react';
import { UserProfile, ReminderType } from '../types';
import { playSound } from '../App';

const CLICK_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, onUpdateProfile }) => {
  const [formData, setFormData] = useState<any>({
    ...profile,
    weight: profile.weight.toString(),
    dailyGoal: profile.dailyGoal.toString(),
    avatarSeed: profile.avatarSeed || profile.name
  });
  const [newTime, setNewTime] = useState('09:00');
  const isDark = profile.darkModeEnabled;

  const AVATAR_PRESETS = ['Felix', 'Aneka', 'Mason', 'Jude', 'Caspian', 'Avery', 'Rylee', 'Emery'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleHaptic = () => {
    setFormData((prev: any) => ({ ...prev, hapticEnabled: !prev.hapticEnabled }));
  };

  const handleToggleDarkMode = () => {
    setFormData((prev: any) => ({ ...prev, darkModeEnabled: !prev.darkModeEnabled }));
  };

  const handleSave = () => {
    const updatedProfile: UserProfile = {
      ...formData,
      weight: parseFloat(formData.weight) || 0,
      dailyGoal: parseInt(formData.dailyGoal) || 0,
    };
    onUpdateProfile(updatedProfile);
    alert('Settings updated successfully!');
  };

  const calculateGoal = () => {
    playSound(CLICK_SOUND);
    const weightNum = parseFloat(formData.weight) || 0;
    const suggested = weightNum * 33;
    setFormData((prev: any) => ({ ...prev, dailyGoal: Math.round(suggested).toString() }));
  };

  const randomizeAvatar = () => {
    playSound(CLICK_SOUND);
    const randomSeed = Math.random().toString(36).substring(7);
    setFormData((prev: any) => ({ ...prev, avatarSeed: randomSeed }));
  };

  const selectAvatar = (seed: string) => {
    playSound(CLICK_SOUND);
    setFormData((prev: any) => ({ ...prev, avatarSeed: seed }));
  };

  const addTime = () => {
    playSound(CLICK_SOUND);
    if (!formData.scheduledTimes.includes(newTime)) {
      const sorted = [...formData.scheduledTimes, newTime].sort();
      setFormData((prev: any) => ({ ...prev, scheduledTimes: sorted }));
    }
  };

  const removeTime = (time: string) => {
    playSound(CLICK_SOUND);
    setFormData((prev: any) => ({ ...prev, scheduledTimes: prev.scheduledTimes.filter((t: string) => t !== time) }));
  };

  const toggleReminderType = (type: ReminderType) => {
    playSound(CLICK_SOUND);
    setFormData((p: any) => ({ ...p, reminderType: type }));
  };

  const inputClass = `w-full px-5 py-4 rounded-2xl border transition-all duration-300 focus:ring-4 outline-none font-bold text-base ${
    isDark 
      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-blue-500/20 focus:border-blue-500' 
      : 'bg-slate-50/80 border-slate-100 text-slate-800 placeholder-slate-400 focus:ring-blue-100 focus:border-blue-400'
  }`;

  const labelClass = `text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1`;

  const cardClass = `rounded-3xl p-6 sm:p-8 space-y-6 border transition-all ${
    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl shadow-slate-200/40'
  }`;

  return (
    <div className="flex flex-col gap-6 sm:gap-10 animate-fadeIn pb-40">
      <div className="px-1">
         <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>User Preferences</h2>
         <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Customize your hydration journey</p>
      </div>
      
      <div className="space-y-6 sm:space-y-10">
        {/* Avatar Section */}
        <section className={cardClass}>
           <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
             <i className="fas fa-palette"></i> Profile Style
           </h3>
           <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2.5rem] bg-blue-50 border-4 border-blue-600 p-1 shadow-2xl shadow-blue-200 overflow-hidden">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.avatarSeed}`} 
                    className="w-full h-full object-cover"
                    alt="Current Avatar"
                  />
                </div>
                <button 
                  onClick={randomizeAvatar}
                  className="absolute -bottom-2 -right-2 w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl border border-blue-50 hover:scale-110 active:scale-95 transition-all"
                >
                  <i className="fas fa-arrows-rotate"></i>
                </button>
              </div>

              <div className="flex-1 w-full space-y-4">
                <label className={labelClass}>Select a Preset</label>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                   {AVATAR_PRESETS.slice(0, 8).map((seed) => (
                      <button
                        key={seed}
                        onClick={() => selectAvatar(seed)}
                        className={`aspect-square rounded-2xl border-2 transition-all p-1 overflow-hidden ${
                          formData.avatarSeed === seed ? 'border-blue-600 bg-blue-50' : 'border-transparent bg-slate-50 opacity-60'
                        }`}
                      >
                         <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} 
                          className="w-full h-full object-cover rounded-xl"
                          alt={seed}
                         />
                      </button>
                   ))}
                </div>
              </div>
           </div>
        </section>

        {/* Identity & Body */}
        <section className={cardClass}>
           <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
             <i className="fas fa-user-circle"></i> Identity & Body
           </h3>
           <div className="space-y-6">
              <div>
                <label className={labelClass}>Display Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter name..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Weight (KG)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={labelClass}>Daily Goal (ML)</label>
                  <input
                    type="number"
                    name="dailyGoal"
                    value={formData.dailyGoal}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
              </div>
              <button 
                onClick={calculateGoal} 
                className="w-full py-4 border-2 border-dashed border-blue-200 rounded-2xl text-blue-600 font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors"
              >
                <i className="fas fa-wand-sparkles mr-2"></i> Auto-calculate goal
              </button>
           </div>
        </section>

        {/* Preferences */}
        <section className={cardClass}>
           <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
             <i className="fas fa-sliders"></i> Interface Settings
           </h3>
           <div className="space-y-6">
             <ToggleRow 
                label="Dark Theme" 
                sub="High contrast UI" 
                active={formData.darkModeEnabled} 
                onToggle={handleToggleDarkMode} 
                isDark={isDark} 
             />
             <ToggleRow 
                label="Haptic Feedback" 
                sub="Tactile interactions" 
                active={formData.hapticEnabled} 
                onToggle={handleToggleHaptic} 
                isDark={isDark} 
             />
           </div>
        </section>

        {/* Save Button */}
        <div className="px-2">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black shadow-2xl shadow-blue-400/30 hover:bg-blue-700 active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
          >
            Update Profile <i className="fas fa-check-circle"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const ToggleRow = ({ label, sub, active, onToggle, isDark }: any) => (
  <div className="flex items-center justify-between">
    <div>
      <span className={`block font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{label}</span>
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{sub}</span>
    </div>
    <button 
      onClick={onToggle}
      className={`w-14 h-8 rounded-full transition-all duration-300 relative ${active ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm ${active ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

export default Settings;
