import React from 'react';
import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

// Only routes that take NO params (safe for Home tiles)
type HomeRoute =
  | 'Profile'
  | 'Reminders'
  | 'Trainings'
  | 'Diary'
  | 'InfoShare'
  | 'Suggestions'
  | 'Exercise'
  | 'Ratings'
  | 'Help';

const MENU: { key: HomeRoute; title: string; icon: string }[] = [
  { key: 'Profile', title: 'Profilim', icon: '👤' },
  { key: 'Reminders', title: 'Hatırlatmalar', icon: '⏰' },
  { key: 'Trainings', title: 'Eğitimlerim', icon: '📘' },
  { key: 'Diary', title: 'Günlüğüm', icon: '📝' },
  { key: 'InfoShare', title: 'Bilgi Paylaşımı', icon: '💬' },
  { key: 'Suggestions', title: 'Öneriler', icon: '💡' },
  { key: 'Exercise', title: 'Beslenme & Egzersiz', icon: '🏃‍♂️' },
  { key: 'Ratings', title: 'Görüşlerim', icon: '⭐' },
  { key: 'Help', title: 'Yardım', icon: '🆘' },
];

export function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <FlatList
        data={MENU}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: SPACING.md, gap: 12 }}
        keyExtractor={(i) => i.key}
        renderItem={({ item }) => (
          <Pressable style={styles.tile} onPress={() => navigation.navigate(item.key)}>
            <View style={styles.icon}>
              <Text style={styles.iconTxt}>{item.icon}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  tile: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  icon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FCE7DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconTxt: { fontSize: 24 },
  title: { fontWeight: '900', color: COLORS.text, textAlign: 'center' },
});