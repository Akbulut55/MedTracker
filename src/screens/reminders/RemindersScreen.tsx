import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Reminders'>;

export function RemindersScreen({ navigation }: Props) {
  const { reminders, deleteReminder } = useData();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('AddReminder')} style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={{ color: 'white', fontWeight: '900' }}>+ Add</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.root}>
      <FlatList
        data={reminders}
        keyExtractor={x => x.id}
        contentContainerStyle={{ padding: SPACING.md, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>No reminders yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.sub}>{item.detail}</Text>
            <Text style={styles.meta}>{item.module} | {item.createdAt}</Text>

            <Pressable onPress={() => deleteReminder(item.id)} style={styles.del}>
              <Text style={{ color: 'white', fontWeight: '900' }}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  title: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  sub: { marginTop: 6, color: COLORS.text },
  meta: { marginTop: 8, color: COLORS.muted, fontSize: 12 },
  del: { marginTop: 10, backgroundColor: COLORS.danger, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  empty: { color: COLORS.muted, padding: SPACING.md },
});
