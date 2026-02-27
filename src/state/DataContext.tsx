import React, { createContext, useContext, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Training = { id: string; title: string; summary: string; body: string };
export type Reminder = { id: string; title: string; detail: string; module: string; createdAt: string };
export type Note = { id: string; title: string; content: string; createdAt: string };
export type ExerciseEntry = {
  id: string;
  date: string;
  dateKey: string;
  vegGrams: number;
  fruitGrams: number;
  minutes: number;
  types: string[];
  feltBad: boolean;
};
export type MedicationSlot = 'Morning' | 'Noon' | 'Evening' | 'Night';
export type Medication = {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  createdAt: string;
  slots: MedicationSlot[];
  takenSlotKeys: string[];
};
export type SymptomEntry = {
  id: string;
  date: string;
  dateKey: string;
  pain: number;
  fatigue: number;
  sleepHours: number;
  mood: 'Good' | 'Neutral' | 'Bad';
  note: string;
};
export type Suggestion = { id: string; text: string; createdAt: string; likes: number; dislikes: number };
export type TopicComment = { id: string; author: string; text: string; createdAt: string };
export type Topic = { id: string; title: string; likes: number; comments: TopicComment[] };
export type Rating = { id: string; user: string; stars: number; createdAt: string };

type PersistedData = {
  reminders: Reminder[];
  notes: Note[];
  exercise: ExerciseEntry[];
  medications: Medication[];
  symptoms: SymptomEntry[];
  suggestions: Suggestion[];
  topics: Topic[];
  ratings: Rating[];
};

type PersistEnvelope = {
  version: number;
  data: PersistedData;
};

type ResetModuleKey =
  | 'reminders'
  | 'notes'
  | 'exercise'
  | 'medications'
  | 'symptoms'
  | 'ratings'
  | 'suggestions'
  | 'topics';

type DataCtx = {
  trainings: Training[];
  reminders: Reminder[];
  notes: Note[];
  exercise: ExerciseEntry[];
  medications: Medication[];
  symptoms: SymptomEntry[];
  suggestions: Suggestion[];
  topics: Topic[];
  ratings: Rating[];
  hydrated: boolean;

  addReminder: (title: string, detail: string, module?: string) => void;
  updateReminder: (id: string, title: string, detail: string, module?: string) => void;
  deleteReminder: (id: string) => void;

  addNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;

  addExerciseEntry: (vegGrams: number, fruitGrams: number, minutes: number, types: string[], feltBad: boolean) => void;
  updateExerciseEntry: (id: string, vegGrams: number, fruitGrams: number, minutes: number, types: string[], feltBad: boolean) => void;
  deleteExerciseEntry: (id: string) => void;

  addMedication: (name: string, dose: string, frequency: string, slots: MedicationSlot[]) => void;
  updateMedication: (id: string, name: string, dose: string, frequency: string, slots: MedicationSlot[]) => void;
  deleteMedication: (id: string) => void;
  toggleMedicationTaken: (id: string, slot: MedicationSlot, dateKey?: string) => void;

  addSymptomEntry: (pain: number, fatigue: number, sleepHours: number, mood: 'Good' | 'Neutral' | 'Bad', note?: string) => void;
  deleteSymptomEntry: (id: string) => void;

  likeSuggestion: (id: string) => void;
  dislikeSuggestion: (id: string) => void;

  likeTopic: (id: string) => void;
  addComment: (topicId: string, author: string, text: string) => void;

  addRating: (user: string, stars: number) => void;
  resetModuleData: (module: ResetModuleKey) => void;
  exportBackupJSON: () => string;
  importBackupJSON: (raw: string) => { ok: true } | { ok: false; error: string };
  clearAllData: () => void;
};

const Ctx = createContext<DataCtx | null>(null);
const STORAGE_KEY = 'medtracker_data_v1';
const DATA_SCHEMA_VERSION = 2;

const makeId = (prefix: string) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
const toDateKey = (value = new Date()) => value.toISOString().slice(0, 10);
const coerceDateKey = (input?: string) => {
  if (!input) return toDateKey();
  const m = input.match(/\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : toDateKey();
};
const isMedicationSlot = (value: string): value is MedicationSlot =>
  value === 'Morning' || value === 'Noon' || value === 'Evening' || value === 'Night';
const currentSlot = (): MedicationSlot => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'Morning';
  if (hour >= 11 && hour < 15) return 'Noon';
  if (hour >= 15 && hour < 21) return 'Evening';
  return 'Night';
};

const seedTrainings: Training[] = [
  {
    id: 't1',
    title: 'What Is Multiple Myeloma?',
    summary: 'Basic overview of the condition',
    body:
      'This is sample education content.\n\n- Definition\n- Symptoms\n- Diagnosis\n- Treatment\n\nYou can replace this with your final course text.',
  },
  {
    id: 't2',
    title: 'Pain Management',
    summary: 'Daily practical tips',
    body: 'Follow your care plan, track symptoms, and keep gentle routine activity when possible.',
  },
];

const seedSuggestions: Suggestion[] = [
  { id: 's1', text: 'Use a mask in crowded places.', createdAt: new Date().toLocaleString(), likes: 8, dislikes: 0 },
  { id: 's2', text: 'Try short low-intensity walks.', createdAt: new Date().toLocaleString(), likes: 3, dislikes: 1 },
];

const seedTopics: Topic[] = [
  {
    id: 'k1',
    title: 'Working patients',
    likes: 2,
    comments: [{ id: 'c1', author: 'admin', text: 'You can share your experience here.', createdAt: new Date().toLocaleString() }],
  },
  {
    id: 'k2',
    title: 'Herbal products',
    likes: 1,
    comments: [{ id: 'c2', author: 'admin', text: 'Please consult your doctor before use.', createdAt: new Date().toLocaleString() }],
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [trainings] = useState(seedTrainings);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [exercise, setExercise] = useState<ExerciseEntry[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(seedSuggestions);
  const [topics, setTopics] = useState<Topic[]>(seedTopics);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const buildPersisted = React.useCallback(
    (): PersistedData => ({ reminders, notes, exercise, medications, symptoms, suggestions, topics, ratings }),
    [reminders, notes, exercise, medications, symptoms, suggestions, topics, ratings],
  );

  const applyPersisted = React.useCallback((source: PersistedData) => {
    setReminders(source.reminders ?? []);
    setNotes(source.notes ?? []);
    setExercise((source.exercise ?? []).map(e => ({ ...e, dateKey: coerceDateKey(e.dateKey ?? e.date) })));
    setMedications(
      (source.medications ?? []).map(m => {
        const existingSlots = (m.slots ?? []).filter(isMedicationSlot);
        const slotKeys = m.takenSlotKeys?.length
          ? m.takenSlotKeys
          : (m as Medication & { takenDates?: string[] }).takenDates?.map(d => `${d}|Morning`) ?? [];
        return { ...m, slots: existingSlots.length ? existingSlots : ['Morning'], takenSlotKeys: slotKeys };
      }),
    );
    setSymptoms((source.symptoms ?? []).map(s => ({ ...s, dateKey: coerceDateKey(s.dateKey ?? s.date) })));
    setSuggestions(source.suggestions?.length ? source.suggestions : seedSuggestions);
    setTopics(source.topics?.length ? source.topics : seedTopics);
    setRatings(source.ratings ?? []);
  }, []);

  React.useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistEnvelope | PersistedData;
          const migrated: PersistedData =
            'version' in parsed && 'data' in parsed
              ? parsed.data
              : {
                  reminders: (parsed as PersistedData).reminders ?? [],
                  notes: (parsed as PersistedData).notes ?? [],
                  exercise: (parsed as PersistedData).exercise ?? [],
                  medications: (parsed as PersistedData).medications ?? [],
                  symptoms: (parsed as PersistedData).symptoms ?? [],
                  suggestions: (parsed as PersistedData).suggestions ?? [],
                  topics: (parsed as PersistedData).topics ?? [],
                  ratings: (parsed as PersistedData).ratings ?? [],
                };
          applyPersisted(migrated);
        }
      } catch {
        // Keep defaults on parse/read failure.
      } finally {
        setHydrated(true);
      }
    };
    load();
  }, [applyPersisted]);

  React.useEffect(() => {
    if (!hydrated) return;
    const toSave: PersistEnvelope = { version: DATA_SCHEMA_VERSION, data: buildPersisted() };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)).catch(() => {});
  }, [hydrated, buildPersisted]);

  const value = useMemo<DataCtx>(
    () => ({
      trainings,
      reminders,
      notes,
      exercise,
      medications,
      symptoms,
      suggestions,
      topics,
      ratings,
      hydrated,

      addReminder: (title, detail, module = 'General') => {
        setReminders(prev => [{ id: makeId('r'), title, detail, module, createdAt: new Date().toLocaleString() }, ...prev]);
      },
      updateReminder: (id, title, detail, module = 'General') => {
        setReminders(prev => prev.map(r => (r.id === id ? { ...r, title, detail, module } : r)));
      },
      deleteReminder: id => setReminders(prev => prev.filter(r => r.id !== id)),

      addNote: (title, content) => {
        setNotes(prev => [{ id: makeId('n'), title, content, createdAt: new Date().toLocaleString() }, ...prev]);
      },
      updateNote: (id, title, content) => {
        setNotes(prev => prev.map(n => (n.id === id ? { ...n, title, content } : n)));
      },
      deleteNote: id => setNotes(prev => prev.filter(n => n.id !== id)),

      addExerciseEntry: (vegGrams, fruitGrams, minutes, types, feltBad) => {
        setExercise(prev => [
          { id: makeId('x'), date: new Date().toLocaleString(), dateKey: toDateKey(), vegGrams, fruitGrams, minutes, types, feltBad },
          ...prev,
        ]);
      },
      updateExerciseEntry: (id, vegGrams, fruitGrams, minutes, types, feltBad) => {
        setExercise(prev => prev.map(x => (x.id === id ? { ...x, vegGrams, fruitGrams, minutes, types, feltBad } : x)));
      },
      deleteExerciseEntry: id => setExercise(prev => prev.filter(x => x.id !== id)),

      addMedication: (name, dose, frequency, slots) => {
        setMedications(prev => [
          { id: makeId('m'), name, dose, frequency, createdAt: new Date().toLocaleString(), slots, takenSlotKeys: [] },
          ...prev,
        ]);
      },
      updateMedication: (id, name, dose, frequency, slots) => {
        setMedications(prev => prev.map(m => (m.id === id ? { ...m, name, dose, frequency, slots } : m)));
      },
      deleteMedication: id => setMedications(prev => prev.filter(m => m.id !== id)),
      toggleMedicationTaken: (id, slot = currentSlot(), dateKey = toDateKey()) => {
        setMedications(prev =>
          prev.map(m => {
            if (m.id !== id) return m;
            const key = `${dateKey}|${slot}`;
            const exists = m.takenSlotKeys.includes(key);
            return {
              ...m,
              takenSlotKeys: exists ? m.takenSlotKeys.filter(d => d !== key) : [...m.takenSlotKeys, key],
            };
          }),
        );
      },

      addSymptomEntry: (pain, fatigue, sleepHours, mood, note = '') => {
        setSymptoms(prev => [
          { id: makeId('sym'), date: new Date().toLocaleString(), dateKey: toDateKey(), pain, fatigue, sleepHours, mood, note },
          ...prev,
        ]);
      },
      deleteSymptomEntry: id => setSymptoms(prev => prev.filter(s => s.id !== id)),

      likeSuggestion: id => {
        setSuggestions(prev => prev.map(s => (s.id === id ? { ...s, likes: s.likes + 1 } : s)));
      },
      dislikeSuggestion: id => {
        setSuggestions(prev => prev.map(s => (s.id === id ? { ...s, dislikes: s.dislikes + 1 } : s)));
      },

      likeTopic: id => {
        setTopics(prev => prev.map(t => (t.id === id ? { ...t, likes: t.likes + 1 } : t)));
      },
      addComment: (topicId, author, text) => {
        setTopics(prev =>
          prev.map(t => {
            if (t.id !== topicId) return t;
            const c: TopicComment = { id: makeId('c'), author, text, createdAt: new Date().toLocaleString() };
            return { ...t, comments: [...t.comments, c] };
          }),
        );
      },

      addRating: (user, stars) => {
        setRatings(prev => [{ id: makeId('g'), user, stars, createdAt: new Date().toLocaleString() }, ...prev]);
      },

      resetModuleData: module => {
        if (module === 'reminders') setReminders([]);
        if (module === 'notes') setNotes([]);
        if (module === 'exercise') setExercise([]);
        if (module === 'medications') setMedications([]);
        if (module === 'symptoms') setSymptoms([]);
        if (module === 'ratings') setRatings([]);
        if (module === 'suggestions') setSuggestions(seedSuggestions);
        if (module === 'topics') setTopics(seedTopics);
      },

      exportBackupJSON: () => JSON.stringify({ version: DATA_SCHEMA_VERSION, data: buildPersisted() }, null, 2),

      importBackupJSON: (raw: string) => {
        try {
          const parsed = JSON.parse(raw) as PersistEnvelope | PersistedData;
          const data: PersistedData =
            'version' in parsed && 'data' in parsed
              ? parsed.data
              : {
                  reminders: (parsed as PersistedData).reminders ?? [],
                  notes: (parsed as PersistedData).notes ?? [],
                  exercise: (parsed as PersistedData).exercise ?? [],
                  medications: (parsed as PersistedData).medications ?? [],
                  symptoms: (parsed as PersistedData).symptoms ?? [],
                  suggestions: (parsed as PersistedData).suggestions ?? [],
                  topics: (parsed as PersistedData).topics ?? [],
                  ratings: (parsed as PersistedData).ratings ?? [],
                };
          applyPersisted(data);
          return { ok: true };
        } catch {
          return { ok: false, error: 'Invalid JSON backup format.' };
        }
      },

      clearAllData: () => {
        setReminders([]);
        setNotes([]);
        setExercise([]);
        setMedications([]);
        setSymptoms([]);
        setRatings([]);
        setSuggestions(seedSuggestions);
        setTopics(seedTopics);
      },
    }),
    [trainings, reminders, notes, exercise, medications, symptoms, suggestions, topics, ratings, hydrated, buildPersisted, applyPersisted],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const v = useContext(Ctx);
  if (!v) throw new Error('DataContext missing');
  return v;
}
