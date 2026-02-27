import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'TrainingDetail'>;

export function TrainingDetailScreen({ route }: Props) {
  const { trainings } = useData();
  const t = trainings.find(x => x.id === route.params.id);

  if (!t) return <View style={styles.root}><Text>Not found</Text></View>;

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: SPACING.md }}>
      <View style={styles.card}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.body}>{t.body}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  title: { fontWeight: '900', color: COLORS.text, fontSize: 18 },
  body: { marginTop: 10, color: COLORS.text, lineHeight: 20 },
});