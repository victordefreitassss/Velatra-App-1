
export type Role = "owner" | "coach" | "member";
export type Gender = "F" | "M";
export type Goal = "Perte de poids" | "Prise de masse" | "Sport santé bien-être" | "Prépa physique" | "Remise en forme" | "Performance sportive" | "Renforcement musculaire" | "Souplesse et mobilité" | "Autre";

export interface Club {
  id: string;
  name: string;
  ownerId: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  horaires: string;
  googleReview?: string;
  mapsLink?: string;
  logo?: string;
  primaryColor?: string;
  createdAt: string;
}

export interface User {
  id: number;
  clubId: string;
  code: string;
  pwd: string;
  name: string;
  role: Role;
  avatar: string;
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  objectifs: Goal[];
  notes: string;
  createdAt: string;
  xp: number;
  streak: number;
  lastWorkoutDate?: string;
  pointsFidelite: number;
  planRequested?: boolean;
  firebaseUid?: string;
}

export interface SupplementProduct {
  id: string;
  clubId: string;
  nom: string;
  prixVente: number;
  prixAchat: number;
  stock: number;
  cat: string;
}

export interface SupplementOrder {
  id: string;
  clubId: string;
  adherentId: number;
  coachName: string;
  date: string;
  mois: string;
  produits: { nom: string, quantite: number, prixUnitaire: number }[];
  total: number;
  pointsGagnes: number;
  status: 'requested' | 'completed' | 'cancelled';
}

export interface FixedCost {
  id: string;
  clubId: string;
  name: string;
  amount: number;
}

export interface CommissionPayment {
  id: string;
  clubId: string;
  coach: string;
  month: string;
  amount: number;
  date: string;
  notes: string;
}

export interface Exercise {
  id: number;
  clubId: string; // Can be 'global' or a specific clubId
  name: string;
  cat: string;
  equip: string;
  photo: string | null;
  perfId: string | null;
}

export interface ExerciseEntry {
  exId: number;
  sets: number | string;
  reps: string;
  rest: string;
  tempo: string;
  duration: string;
  notes: string;
  setGroup: number | null;
  setType: "normal" | "superset" | "biset" | "triset" | "giantset" | "dropset" | "custom" | null;
  setName: string | null;
}

export interface Day {
  name: string;
  isCoaching: boolean;
  exercises: ExerciseEntry[];
}

export interface Program {
  id: number;
  clubId: string;
  memberId: number;
  name: string;
  presetId: number | null;
  nbDays: number;
  startDate: string;
  completedWeeks: number[];
  currentDayIndex: number;
  days: Day[];
  memberRemarks?: string; // Remarques de l'adhérent
}

export interface Preset {
  id: number;
  clubId: string;
  name: string;
  objectifs: Goal[];
  remarks: string;
  nbDays: number;
  days: Day[];
  createdBy: number;
}

export interface SessionLog {
  id: number;
  clubId: string;
  memberId: number;
  date: string;
  week: number;
  isCoaching: boolean;
  dayName: string;
  exerciseData: Record<string, string>;
  totalVolume?: number;
}

export interface Performance {
  id: number;
  clubId: string;
  memberId: number;
  date: string;
  exId: string;
  weight: number;
  reps: number;
  fromCoaching: boolean;
}

export interface BodyData {
  id: number;
  clubId: string;
  memberId: number;
  date: string;
  weight: number;
  fat: number;
  muscle: number;
  photoBefore?: string;
  photoAfter?: string;
}

export interface CoachInfo {
  id: number;
  clubId: string;
  name: string;
  role: string;
  whatsapp: string;
  photo: string | null;
}

export interface ClubInfo {
  phone: string;
  email: string;
  googleReview: string;
  description: string;
  horaires: string;
  adresse: string;
  mapsLink: string;
}

export interface Message {
  id: number;
  clubId: string;
  from: number;
  to: number | null;
  text: string;
  date: string;
  read: boolean;
  file: string | null;
}

export interface FeedItem {
  id: number;
  clubId: string;
  userId: number;
  userName: string;
  type: 'pr' | 'session' | 'level';
  title: string;
  date: string;
}

export interface Prospect {
  id: number;
  clubId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  status: 'pending' | 'converted' | 'rejected';
  answers: Record<string, string>;
  notes?: string;
}

export interface Newsletter {
  id: number;
  clubId: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export type Page = "home" | "users" | "presets" | "performances" | "charts" | "exercises" | "history" | "gift" | "about" | "database" | "calendar" | "trophy" | "workout" | "messages" | "feed" | "supplements" | "loyalty" | "prospects" | "marketing" | "ai_coach";

export interface AppState {
  user: User | null;
  currentClub: Club | null;
  users: User[];
  exercises: Exercise[];
  programs: Program[];
  presets: Preset[];
  logs: SessionLog[];
  messages: Message[];
  bodyData: BodyData[];
  performances: Performance[];
  archivedPrograms: Program[];
  feed: FeedItem[];
  supplementProducts: SupplementProduct[];
  supplementOrders: SupplementOrder[];
  fixedCosts: FixedCost[];
  commissionPayments: CommissionPayment[];
  prospects: Prospect[];
  newsletters: Newsletter[];
  aboutInfo: ClubInfo;
  coaches: CoachInfo[];
  page: Page;
  selectedMember: User | null;
  selectedDay: number;
  editingProg: Program | null;
  editingPreset: Preset | null;
  workout: Program | null;
  workoutData: Record<string, string>;
  workoutMember: User | null;
  validatedExercises: number[];
  modal: string | null;
  toast: { message: string, type: 'success' | 'error' | 'info' } | null;
  aiSuggestion?: string;
}
