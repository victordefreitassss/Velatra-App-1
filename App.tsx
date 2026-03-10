
import React, { useState, useEffect } from 'react';
import { 
  User, AppState, Program, Preset, SessionLog, Performance, BodyData, Message, FeedItem,
  SupplementProduct, SupplementOrder, FixedCost, CommissionPayment, Prospect, Newsletter, Club, Exercise
} from './types';
import { 
  INIT_EXERCISES, CLUB_INFO, COACHES 
} from './constants';
import { 
  auth, db, 
  onAuthStateChanged, signOut, 
  doc, getDoc, setDoc, onSnapshot, updateDoc, collection, deleteDoc, query, where
} from './firebase';

// Layout & UI
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Toast } from './components/Toast';
import { WorkoutView } from './components/WorkoutView';
import { ProgramEditor } from './components/Editor';

// Pages
import { CoachDashboard } from './components/CoachDashboard';
import { MemberDashboard } from './components/MemberDashboard';
import { MembersPage } from './pages/MembersPage';
import { PresetsPage } from './pages/PresetsPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { MessagesPage } from './pages/MessagesPage';
import { AboutPage } from './pages/AboutPage';
import { StatsPage } from './pages/StatsPage';
import { CalendarPage } from './pages/CalendarPage';
import { TrophyPage } from './pages/TrophyPage';
import { MemberLoyaltyPage } from './pages/MemberLoyaltyPage';
import { HistoryPage } from './pages/HistoryPage';
import { AICoachPage } from './pages/AICoachPage';

const INITIAL_STATE: AppState = {
  user: null,
  currentClub: null,
  users: [],
  exercises: INIT_EXERCISES,
  programs: [],
  presets: [],
  logs: [],
  messages: [],
  bodyData: [],
  performances: [],
  archivedPrograms: [],
  feed: [],
  supplementProducts: [],
  supplementOrders: [],
  fixedCosts: [],
  commissionPayments: [],
  prospects: [],
  newsletters: [],
  aboutInfo: CLUB_INFO,
  coaches: COACHES,
  page: 'home',
  selectedMember: null,
  selectedDay: 0,
  editingProg: null,
  editingPreset: null,
  workout: null,
  workoutData: {},
  workoutMember: null,
  validatedExercises: [],
  modal: null,
  toast: null
};

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubUserDoc: () => void;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        
        // Listen to the user document so it updates automatically when created during registration
        unsubUserDoc = onSnapshot(userDocRef, async (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setState(prev => ({ ...prev, user: { ...userData, firebaseUid: firebaseUser.uid } }));
            
            // Fetch Club Data
            if (userData.clubId) {
              const clubDoc = await getDoc(doc(db, "clubs", userData.clubId));
              if (clubDoc.exists()) {
                setState(prev => ({ ...prev, currentClub: clubDoc.data() as Club }));
              }
            }
          } else {
            // Document not created yet (happens during registration)
            setState(prev => ({ ...prev, user: null }));
          }
          setLoading(false);
        });
      } else {
        if (unsubUserDoc) unsubUserDoc();
        setState(prev => ({ ...prev, user: null }));
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, []);

  useEffect(() => {
    if (!state.user || !state.user.clubId) return;

    const clubId = state.user.clubId;

    const unsubClub = onSnapshot(doc(db, "clubs", clubId), (docSnap) => {
      if (docSnap.exists()) {
        const clubData = docSnap.data() as Club;
        setState(prev => ({
          ...prev,
          currentClub: clubData,
          aboutInfo: {
            phone: clubData.phone,
            email: clubData.email,
            googleReview: clubData.googleReview || "",
            description: clubData.description,
            horaires: clubData.horaires,
            adresse: clubData.address,
            mapsLink: clubData.mapsLink || ""
          }
        }));
      }
    });

    const unsubUsers = onSnapshot(query(collection(db, "users"), where("clubId", "==", clubId)), (snap) => {
      const allUsers: User[] = [];
      snap.forEach(d => {
        const data = d.data();
        allUsers.push({ 
          ...data, 
          id: Number(data.id) || 0,
          xp: Number(data.xp) || 0,
          streak: Number(data.streak) || 0,
          pointsFidelite: Number(data.pointsFidelite) || 0,
          firebaseUid: d.id 
        } as any);
      });
      setState(prev => ({ ...prev, users: allUsers }));
    });

    const unsubProgs = onSnapshot(query(collection(db, "programs"), where("clubId", "==", clubId)), (snap) => {
      const allProgs: Program[] = [];
      snap.forEach(d => {
        const data = d.data();
        allProgs.push({
          ...data,
          id: Number(data.id),
          memberId: Number(data.memberId)
        } as Program);
      });
      setState(prev => ({ ...prev, programs: allProgs }));
    });

    const unsubPresets = onSnapshot(query(collection(db, "presets"), where("clubId", "==", clubId)), (snap) => {
      const allPresets: Preset[] = [];
      snap.forEach(d => allPresets.push(d.data() as Preset));
      setState(prev => ({ ...prev, presets: allPresets }));
    });

    const unsubArchives = onSnapshot(query(collection(db, "archivedPrograms"), where("clubId", "==", clubId)), (snap) => {
      const allArchives: Program[] = [];
      snap.forEach(d => allArchives.push(d.data() as Program));
      setState(prev => ({ ...prev, archivedPrograms: allArchives }));
    });

    const unsubPerfs = onSnapshot(query(collection(db, "performances"), where("clubId", "==", clubId)), (snap) => {
      const perfs: Performance[] = [];
      snap.forEach(d => {
        const data = d.data();
        perfs.push({
          ...data,
          id: Number(data.id),
          memberId: Number(data.memberId),
          weight: Number(data.weight),
          reps: Number(data.reps)
        } as Performance);
      });
      setState(prev => ({ ...prev, performances: perfs }));
    });

    const unsubProducts = onSnapshot(query(collection(db, "supplementProducts"), where("clubId", "==", clubId)), (snap) => {
      const products: SupplementProduct[] = [];
      snap.forEach(d => products.push(d.data() as SupplementProduct));
      setState(prev => ({ ...prev, supplementProducts: products }));
    });

    const unsubOrders = onSnapshot(query(collection(db, "supplementOrders"), where("clubId", "==", clubId)), (snap) => {
      const orders: SupplementOrder[] = [];
      snap.forEach(d => orders.push(d.data() as SupplementOrder));
      setState(prev => ({ ...prev, supplementOrders: orders }));
    });

    const unsubLogs = onSnapshot(query(collection(db, "logs"), where("clubId", "==", clubId)), (snap) => {
      const logs: SessionLog[] = [];
      snap.forEach(d => {
        const data = d.data();
        logs.push({
          ...data,
          id: Number(data.id),
          memberId: Number(data.memberId)
        } as SessionLog);
      });
      setState(prev => ({ ...prev, logs }));
    });

    const unsubMessages = onSnapshot(query(collection(db, "messages"), where("clubId", "==", clubId)), (snap) => {
      const messages: Message[] = [];
      snap.forEach(d => messages.push(d.data() as Message));
      setState(prev => ({ ...prev, messages }));
    });

    const unsubFeed = onSnapshot(query(collection(db, "feed"), where("clubId", "==", clubId)), (snap) => {
      const feed: FeedItem[] = [];
      snap.forEach(d => feed.push(d.data() as FeedItem));
      feed.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setState(prev => ({ ...prev, feed }));
    });

    const unsubBody = onSnapshot(query(collection(db, "bodyData"), where("clubId", "==", clubId)), (snap) => {
      const bodyData: BodyData[] = [];
      snap.forEach(d => {
        const data = d.data();
        bodyData.push({
          ...data,
          id: Number(data.id),
          memberId: Number(data.memberId),
          weight: Number(data.weight),
          fat: Number(data.fat),
          muscle: Number(data.muscle)
        } as BodyData);
      });
      setState(prev => ({ ...prev, bodyData }));
    });

    const unsubProspects = onSnapshot(query(collection(db, "prospects"), where("clubId", "==", clubId)), (snap) => {
      const prospects: Prospect[] = [];
      snap.forEach(d => prospects.push(d.data() as Prospect));
      setState(prev => ({ ...prev, prospects }));
    });

    const unsubNewsletters = onSnapshot(query(collection(db, "newsletters"), where("clubId", "==", clubId)), (snap) => {
      const newsletters: Newsletter[] = [];
      snap.forEach(d => newsletters.push(d.data() as Newsletter));
      setState(prev => ({ ...prev, newsletters: newsletters.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }));
    });

    const unsubExercises = onSnapshot(query(collection(db, "exercises"), where("clubId", "in", ["global", clubId])), (snap) => {
      const exercises: Exercise[] = [];
      snap.forEach(d => exercises.push(d.data() as Exercise));
      setState(prev => ({ ...prev, exercises: exercises.length > 0 ? exercises : INIT_EXERCISES }));
    });

    return () => {
      unsubClub(); unsubUsers(); unsubProgs(); unsubPresets(); 
      unsubArchives(); unsubPerfs(); unsubProducts(); unsubOrders();
      unsubLogs(); unsubMessages(); unsubFeed(); unsubBody();
      unsubProspects(); unsubNewsletters(); unsubExercises();
    };
  }, [state.user?.clubId]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setState(prev => ({ ...prev, toast: { message, type } }));
    setTimeout(() => setState(prev => ({ ...prev, toast: null })), 3000);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast("Déconnexion réussie");
    } catch (err) {
      showToast("Erreur", "error");
    }
  };

  const renderActivePageContent = (user: User) => {
    if (state.editingProg || state.editingPreset) {
      return (
        <ProgramEditor 
          program={state.editingProg}
          preset={state.editingPreset}
          exercises={state.exercises}
          clubId={user.clubId}
          allPresets={state.presets}
          onSave={async (data) => {
            const dataWithClub = { ...data, clubId: user.clubId };
            await setDoc(doc(db, state.editingProg ? "programs" : "presets", data.id.toString()), dataWithClub);
            setState(s => ({ ...s, editingProg: null, editingPreset: null }));
            showToast("Enregistré");
          }}
          onCancel={() => setState(s => ({ ...s, editingProg: null, editingPreset: null }))}
        />
      );
    }

    const { page } = state;

    if (user.role === 'coach' || user.role === 'owner') {
      switch (page) {
        case 'home': return <CoachDashboard state={state} setState={setState} onExport={() => {}} onToggleTimer={() => {}} showToast={showToast} />;
        case 'users': return <MembersPage state={state} setState={setState} showToast={showToast} />;
        case 'presets': return <PresetsPage state={state} setState={setState} showToast={showToast} />;
        case 'exercises': return <ExercisesPage state={state} setState={setState} showToast={showToast} />;
        case 'history': return <HistoryPage state={state} setState={setState} />;
        case 'about': return <AboutPage state={state} setState={setState} />;
        default: return <CoachDashboard state={state} setState={setState} onExport={() => {}} onToggleTimer={() => {}} showToast={showToast} />;
      }
    }
    
    switch (page) {
      case 'home': return <MemberDashboard state={state} setState={setState} showToast={showToast} onToggleTimer={() => {}} />;
      case 'calendar': return <CalendarPage state={state} setState={setState} />;
      case 'performances': return <StatsPage state={state} setState={setState} />;
      case 'ai_coach': return <AICoachPage state={state} />;
      case 'loyalty': return <MemberLoyaltyPage state={state} setState={setState} />;
      case 'history': return <HistoryPage state={state} setState={setState} />;
      case 'about': return <AboutPage state={state} setState={setState} />;
      case 'messages': return <MessagesPage state={state} setState={setState} showToast={showToast} />;
      default: return <MemberDashboard state={state} setState={setState} showToast={showToast} onToggleTimer={() => {}} />;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin text-velatra-accent">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
      </div>
    </div>
  );

  if (!state.user) return <Login onLogin={() => {}} onRegister={() => {}} />;

  return (
    <Layout user={state.user} club={state.currentClub} activePage={state.page} onPageChange={(p) => setState(s => ({ ...s, page: p }))} onLogout={handleLogout}>
      {renderActivePageContent(state.user)}
      {state.toast && <Toast message={state.toast.message} type={state.toast.type} />}
      {state.workout && state.workoutMember && (
        <WorkoutView 
          program={state.workout} 
          member={state.workoutMember} 
          state={state}
          setState={setState}
          showToast={showToast}
          onClose={() => setState(s => ({ ...s, workout: null, workoutMember: null }))}
          onComplete={async (log, perfs) => {
            const logWithClub = { ...log, clubId: state.user?.clubId };
            const perfsWithClub = perfs.map(p => ({ ...p, clubId: state.user?.clubId }));
            
            await setDoc(doc(db, "logs", log.id.toString()), logWithClub);
            for (const p of perfsWithClub) await setDoc(doc(db, "performances", p.id.toString()), p);
            setState(s => ({ ...s, workout: null, workoutMember: null }));
            showToast("Séance enregistrée !");
          }}
        />
      )}
    </Layout>
  );
}
