import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Trainings'>;

export function TrainingsScreen({ navigation }: Props) {
  const { trainings } = useData();

  return (
    <View style={styles.root}>
      <FlatList
        data={trainings}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ padding: SPACING.md, gap: 12 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('TrainingDetail', { id: item.id })}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.sub}>{item.summary}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  title: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  sub: { marginTop: 6, color: COLORS.muted },
});