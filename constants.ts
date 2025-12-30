
import { UserProfile, ReminderType } from './types';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex',
  avatarSeed: 'Alex', // Default seed matches name
  weight: 70,
  dailyGoal: 2500,
  reminderType: ReminderType.INTERVAL,
  reminderFrequency: 60,
  scheduledTimes: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
  hapticEnabled: true,
  darkModeEnabled: false,
};

export const WATER_PRESETS = [
  { label: 'Sip', amount: 150, icon: 'fa-glass-water-droplet' },
  { label: 'Glass', amount: 250, icon: 'fa-glass-water' },
  { label: 'Bottle', amount: 500, icon: 'fa-bottle-water' },
  { label: 'Big', amount: 1000, icon: 'fa-bucket' },
];

export const STORAGE_KEYS = {
  PROFILE: 'drinkminder_profile',
  LOGS: 'drinkminder_logs',
};
