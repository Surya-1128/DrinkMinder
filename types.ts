
export interface WaterLog {
  id: string;
  amount: number; // in ml
  timestamp: number;
}

export enum ReminderType {
  INTERVAL = 'interval',
  SCHEDULED = 'scheduled'
}

export interface UserProfile {
  name: string;
  avatarSeed: string; // New field for avatar customization
  weight: number; // in kg
  dailyGoal: number; // in ml
  reminderType: ReminderType;
  reminderFrequency: number; // in minutes (for interval)
  scheduledTimes: string[]; // ['09:00', '11:00', etc.]
  hapticEnabled: boolean;
  darkModeEnabled: boolean;
}

export interface HydrationInsight {
  status: 'excellent' | 'good' | 'average' | 'dehydrated';
  message: string;
  advice: string;
}

export enum TabType {
  DASHBOARD = 'dashboard',
  HISTORY = 'history',
  SETTINGS = 'settings',
  COACH = 'coach'
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
