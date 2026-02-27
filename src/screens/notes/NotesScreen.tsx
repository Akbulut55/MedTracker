import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Notes'>;

export function NotesScreen({ navigation }: Props) {
  const { notes } = useData();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('AddNote')} style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={{ color: 'white', fontWeight: '900' }}>+ Add</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.root}>
      <FlatList
        data={notes}
        keyExtractor={x => x.id}
        contentContainerStyle={{ padding: SPACING.md, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>No notes yet.</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('NoteDetail', { id: item.id })}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.preview} numberOfLines={2}>
              {item.content}
            </Text>
            <Text style={styles.meta}>{item.createdAt}</Text>
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
  preview: { marginTop: 6, color: COLORS.text },
  meta: { marginTop: 8, color: COLORS.muted, fontSize: 12 },
  empty: { color: COLORS.muted, padding: SPACING.md },
});
