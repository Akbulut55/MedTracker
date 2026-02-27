import React from 'react';
import { Pressable, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../state/AuthContext';
import { useSettings } from '../state/SettingsContext';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

import { TrainingsScreen } from '../screens/trainings/TrainingsScreen';
import { TrainingDetailScreen } from '../screens/trainings/TrainingDetailScreen';

import { RemindersScreen } from '../screens/reminders/RemindersScreen';
import { AddReminderScreen } from '../screens/reminders/AddReminderScreen';

import { DiaryScreen } from '../screens/diary/DiaryScreen';
import { DiaryRecordsScreen } from '../screens/diary/DiaryRecordsScreen';

import { ExerciseScreen } from '../screens/exercise/ExerciseScreen';
import { ExerciseRecordsScreen } from '../screens/exercise/ExerciseRecordsScreen';

import { InfoTopicsScreen } from '../screens/info/InfoTopicsScreen';
import { TopicDetailScreen } from '../screens/info/TopicDetailScreen';

import { SuggestionsScreen } from '../screens/suggestions/SuggestionsScreen';

import { RatingsScreen } from '../screens/ratings/RatingsScreen';
import { AdminRatingsScreen } from '../screens/ratings/AdminRatingsScreen';

import { HelpScreen } from '../screens/help/HelpScreen';

export type AppStackParamList = {
  Login: undefined;
  Home: undefined;

  Profile: undefined;

  Trainings: undefined;
  TrainingDetail: { id: string };

  Reminders: undefined;
  AddReminder: undefined;

  Diary: undefined;
  DiaryRecords: undefined;

  Exercise: undefined;
  ExerciseRecords: undefined;

  InfoShare: undefined;
  TopicDetail: { id: string };

  Suggestions: undefined;

  Ratings: undefined;
  AdminRatings: undefined;

  Help: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  const { user, signOut } = useAuth();
  const { accent } = useSettings();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: accent },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: '800' },
      }}
    >
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'MedTracker',
              headerRight: () => (
                <Pressable onPress={signOut} style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
                  <Text style={{ color: 'white', fontWeight: '900' }}>Logout</Text>
                </Pressable>
              ),
            }}
          />

          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />

          <Stack.Screen name="Trainings" component={TrainingsScreen} options={{ title: 'Trainings' }} />
          <Stack.Screen name="TrainingDetail" component={TrainingDetailScreen} options={{ title: 'Training' }} />

          <Stack.Screen name="Reminders" component={RemindersScreen} options={{ title: 'Reminders' }} />
          <Stack.Screen name="AddReminder" component={AddReminderScreen} options={{ title: 'Add Reminder' }} />

          <Stack.Screen name="Diary" component={DiaryScreen} options={{ title: 'Diary' }} />
          <Stack.Screen name="DiaryRecords" component={DiaryRecordsScreen} options={{ title: 'Diary Records' }} />

          <Stack.Screen name="Exercise" component={ExerciseScreen} options={{ title: 'Nutrition & Exercise' }} />
          <Stack.Screen name="ExerciseRecords" component={ExerciseRecordsScreen} options={{ title: 'Records' }} />

          <Stack.Screen name="InfoShare" component={InfoTopicsScreen} options={{ title: 'Info Sharing' }} />
          <Stack.Screen name="TopicDetail" component={TopicDetailScreen} options={{ title: 'Topic' }} />

          <Stack.Screen name="Suggestions" component={SuggestionsScreen} options={{ title: 'Suggestions' }} />

          <Stack.Screen name="Ratings" component={RatingsScreen} options={{ title: 'My Rating' }} />
          <Stack.Screen name="AdminRatings" component={AdminRatingsScreen} options={{ title: 'Ratings' }} />

          <Stack.Screen name="Help" component={HelpScreen} options={{ title: 'Help' }} />
        </>
      )}
    </Stack.Navigator>
  );
}