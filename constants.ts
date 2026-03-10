import { User, Exercise, Goal, ClubInfo, CoachInfo, SupplementProduct } from './types';

export const PROGRAM_DURATION_WEEKS = 7;

// Configuration Commerce
export const COMMISSION_THRESHOLD = 300; 
export const LOYALTY_POINT_VALUE = 0.05; 
export const STOCK_ALERT_THRESHOLD = 3;

export const INIT_SUPPLEMENTS: SupplementProduct[] = [];

export const INIT_USERS: User[] = [];

export const GOALS: Goal[] = [
  "Perte de poids", "Prise de masse", "Sport santé bien-être", "Prépa physique",
  "Remise en forme", "Performance sportive", "Renforcement musculaire",
  "Souplesse et mobilité", "Autre"
];

export const EXERCISE_CATEGORIES = [
  "Jambes", "Poitrine", "Dos", "Épaules", "Bras", "Abdos", "Cardio", "Mobilité"
];

export const INIT_EXERCISES: Exercise[] = [
  { id: 1, clubId: "global", name: "Squat barre", cat: "Jambes", equip: "Barre", photo: null, perfId: "squat" },
  { id: 11, clubId: "global", name: "Développé couché", cat: "Poitrine", equip: "Barre", photo: null, perfId: "dc_barre" },
  { id: 21, clubId: "global", name: "Tractions", cat: "Dos", equip: "Poids du corps", photo: null, perfId: "tractions" },
  { id: 31, clubId: "global", name: "Développé militaire", cat: "Épaules", equip: "Barre", photo: null, perfId: "dm" },
  { id: 41, clubId: "global", name: "Curl barre EZ", cat: "Bras", equip: "Barre", photo: null, perfId: "curl" },
  { id: 51, clubId: "global", name: "Crunch au sol", cat: "Abdos", equip: "Poids du corps", photo: null, perfId: "crunch" },
  { id: 61, clubId: "global", name: "Tapis de course", cat: "Cardio", equip: "Machine", photo: null, perfId: "tapis" }
];

export const CLUB_INFO: ClubInfo = {
  phone: "",
  email: "",
  googleReview: "",
  description: "Bienvenue dans votre espace coaching.",
  horaires: "",
  adresse: "",
  mapsLink: ""
};

export const COACHES: CoachInfo[] = [];
