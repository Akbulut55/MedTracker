import React, { createContext, useContext, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Training = { id: string; title: string; summary: string; body: string };
export type Reminder = { id: string; title: string; detail: string; module: string; createdAt: string };
export type Note = { id: string; title: string; content: string; createdAt: string };
export type ExerciseEntry = {
  id: string;
  date: string;
  vegGrams: number;
  fruitGrams: number;
  minutes: number;
  types: string[];
  feltBad: boolean;
};
export type Suggestion = { id: string; text: string; createdAt: string; likes: number; dislikes: number };
export type TopicComment = { id: string; author: string; text: string; createdAt: string };
export type Topic = { id: string; title: string; likes: number; comments: TopicComment[] };
export type Rating = { id: string; user: string; stars: number; createdAt: string };

type PersistedData = {
  reminders: Reminder[];
  notes: Note[];
  exercise: ExerciseEntry[];
  suggestions: Suggestion[];
  topics: Topic[];
  ratings: Rating[];
};

type DataCtx = {
  trainings: Training[];
  reminders: Reminder[];
  notes: Note[];
  exercise: ExerciseEntry[];
  suggestions: Suggestion[];
  topics: Topic[];
  ratings: Rating[];
  hydrated: boolean;

  addReminder: (title: string, detail: string, module?: string) => void;
  deleteReminder: (id: string) => void;

  addNote: (title: string, content: string) => void;
  deleteNote: (id: string) => void;

  addExerciseEntry: (vegGrams: number, fruitGrams: number, minutes: number, types: string[], feltBad: boolean) => void;
  deleteExerciseEntry: (id: string) => void;

  likeSuggestion: (id: string) => void;
  dislikeSuggestion: (id: string) => void;

  likeTopic: (id: string) => void;
  addComment: (topicId: string, author: string, text: string) => void;

  addRating: (user: string, stars: number) => void;
  clearAllData: () => void;
};

const Ctx = createContext<DataCtx | null>(null);
const STORAGE_KEY = 'medtracker_data_v1';

const makeId = (prefix: string) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

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
  const [suggestions, setSuggestions] = useState<Suggestion[]>(seedSuggestions);
  const [topics, setTopics] = useState<Topic[]>(seedTopics);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [hydrated, setHydrated] = useState(false);

  React.useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: PersistedData = JSON.parse(raw);
          setReminders(parsed.reminders ?? []);
          setNotes(parsed.notes ?? []);
          setExercise(parsed.exercise ?? []);
          setSuggestions(parsed.suggestions?.length ? parsed.suggestions : seedSuggestions);
          setTopics(parsed.topics?.length ? parsed.topics : seedTopics);
          setRatings(parsed.ratings ?? []);
        }
      } catch {
        // Keep defaults on parse/read failure.
      } finally {
        setHydrated(true);
      }
    };
    load();
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    const toSave: PersistedData = { reminders, notes, exercise, suggestions, topics, ratings };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)).catch(() => {});
  }, [hydrated, reminders, notes, exercise, suggestions, topics, ratings]);

  const value = useMemo<DataCtx>(
    () => ({
      trainings,
      reminders,
      notes,
      exercise,
      suggestions,
      topics,
      ratings,
      hydrated,

      addReminder: (title, detail, module = 'General') => {
        setReminders(prev => [
          { id: makeId('r'), title, detail, module, createdAt: new Date().toLocaleString() },
          ...prev,
        ]);
      },
      deleteReminder: id => setReminders(prev => prev.filter(r => r.id !== id)),

      addNote: (title, content) => {
        setNotes(prev => [{ id: makeId('n'), title, content, createdAt: new Date().toLocaleString() }, ...prev]);
      },
      deleteNote: id => setNotes(prev => prev.filter(n => n.id !== id)),

      addExerciseEntry: (vegGrams, fruitGrams, minutes, types, feltBad) => {
        setExercise(prev => [
          {
            id: makeId('x'),
            date: new Date().toLocaleString(),
            vegGrams,
            fruitGrams,
            minutes,
            types,
            feltBad,
          },
          ...prev,
        ]);
      },
      deleteExerciseEntry: id => setExercise(prev => prev.filter(x => x.id !== id)),

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

      clearAllData: () => {
        setReminders([]);
        setNotes([]);
        setExercise([]);
        setRatings([]);
        setSuggestions(seedSuggestions);
        setTopics(seedTopics);
      },
    }),
    [trainings, reminders, notes, exercise, suggestions, topics, ratings, hydrated],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const v = useContext(Ctx);
  if (!v) throw new Error('DataContext missing');
  return v;
}
