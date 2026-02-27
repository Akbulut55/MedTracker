import React, { createContext, useContext, useMemo, useState } from 'react';

export type Training = { id: string; title: string; summary: string; body: string };
export type Reminder = { id: string; title: string; detail: string; module: string; createdAt: string };
export type DiaryEntry = { id: string; date: string; pain: number; fatigue: number; appetite: boolean };
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

type DataCtx = {
  trainings: Training[];
  reminders: Reminder[];
  diary: DiaryEntry[];
  exercise: ExerciseEntry[];
  suggestions: Suggestion[];
  topics: Topic[];
  ratings: Rating[];

  addReminder: (title: string, detail: string, module: string) => void;
  deleteReminder: (id: string) => void;

  addDiary: (pain: number, fatigue: number, appetite: boolean) => void;
  addExercise: (vegGrams: number, fruitGrams: number, minutes: number, types: string[], feltBad: boolean) => void;

  reactSuggestion: (id: string, likeDelta: number, dislikeDelta: number) => void;

  likeTopic: (id: string) => void;
  addComment: (topicId: string, author: string, text: string) => void;

  addRating: (user: string, stars: number) => void;
};

const Ctx = createContext<DataCtx | null>(null);

const seedTrainings: Training[] = [
  {
    id: 't1',
    title: 'Multipl Miyelom Nedir?',
    summary: 'Kısa bilgilendirme',
    body:
      'Bu sayfa eğitim içeriği örneğidir.\n\n• Tanım\n• Belirtiler\n• Tanı\n• Tedavi\n\nİstersen öğretmenin verdiği metinleri buraya yapıştır.',
  },
  {
    id: 't2',
    title: 'Ağrı Yönetimi',
    summary: 'Günlük öneriler',
    body: 'Ağrı yönetimi için temel öneriler...\n\n• Düzenli takip\n• Doktor önerisi\n• Basit egzersizler',
  },
];

const seedReminders: Reminder[] = [
  {
    id: 'r1',
    title: 'Su içmeyi unutmayın',
    detail: 'Gün boyunca düzenli su tüketin.',
    module: 'Günlük',
    createdAt: new Date().toLocaleString(),
  },
];

const seedSuggestions: Suggestion[] = [
  { id: 's1', text: 'Kalabalık ortamlarda maske kullanın.', createdAt: new Date().toLocaleString(), likes: 8, dislikes: 0 },
  { id: 's2', text: 'Hafif tempolu yürüyüş yapmayı deneyin.', createdAt: new Date().toLocaleString(), likes: 3, dislikes: 1 },
];

const seedTopics: Topic[] = [
  {
    id: 'k1',
    title: 'Çalışan hastalar',
    likes: 2,
    comments: [{ id: 'c1', author: 'admin', text: 'Deneyimlerinizi paylaşabilirsiniz.', createdAt: new Date().toLocaleString() }],
  },
  {
    id: 'k2',
    title: 'Bitkisel kürler',
    likes: 1,
    comments: [{ id: 'c2', author: 'admin', text: 'Doktorunuza danışmadan kullanmayın.', createdAt: new Date().toLocaleString() }],
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [trainings] = useState(seedTrainings);
  const [reminders, setReminders] = useState(seedReminders);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [exercise, setExercise] = useState<ExerciseEntry[]>([]);
  const [suggestions, setSuggestions] = useState(seedSuggestions);
  const [topics, setTopics] = useState(seedTopics);
  const [ratings, setRatings] = useState<Rating[]>([]);

  const value = useMemo<DataCtx>(
    () => ({
      trainings,
      reminders,
      diary,
      exercise,
      suggestions,
      topics,
      ratings,

      addReminder: (title, detail, module) => {
        setReminders(prev => [
          { id: 'r' + (prev.length + 1), title, detail, module, createdAt: new Date().toLocaleString() },
          ...prev,
        ]);
      },
      deleteReminder: (id) => setReminders(prev => prev.filter(r => r.id !== id)),

      addDiary: (pain, fatigue, appetite) => {
        setDiary(prev => [
          { id: 'd' + (prev.length + 1), date: new Date().toLocaleDateString(), pain, fatigue, appetite },
          ...prev,
        ]);
      },

      addExercise: (vegGrams, fruitGrams, minutes, types, feltBad) => {
        setExercise(prev => [
          {
            id: 'x' + (prev.length + 1),
            date: new Date().toLocaleDateString(),
            vegGrams,
            fruitGrams,
            minutes,
            types,
            feltBad,
          },
          ...prev,
        ]);
      },

      reactSuggestion: (id, likeDelta, dislikeDelta) => {
        setSuggestions(prev =>
          prev.map(s => (s.id === id ? { ...s, likes: s.likes + likeDelta, dislikes: s.dislikes + dislikeDelta } : s))
        );
      },

      likeTopic: (id) => {
        setTopics(prev => prev.map(t => (t.id === id ? { ...t, likes: t.likes + 1 } : t)));
      },
      addComment: (topicId, author, text) => {
        setTopics(prev =>
          prev.map(t => {
            if (t.id !== topicId) return t;
            const c: TopicComment = { id: 'c' + (t.comments.length + 1), author, text, createdAt: new Date().toLocaleString() };
            return { ...t, comments: [...t.comments, c] };
          })
        );
      },

      addRating: (user, stars) => {
        setRatings(prev => [{ id: 'g' + (prev.length + 1), user, stars, createdAt: new Date().toLocaleString() }, ...prev]);
      },
    }),
    [trainings, reminders, diary, exercise, suggestions, topics, ratings]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const v = useContext(Ctx);
  if (!v) throw new Error('DataContext missing');
  return v;
}