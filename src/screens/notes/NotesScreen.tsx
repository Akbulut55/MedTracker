import React from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { EmptyState } from '../../components/ui/EmptyState';

type Props = NativeStackScreenProps<AppStackParamList, 'Notes'>;

export function NotesScreen({ navigation }: Props) {
  const { notes } = useData();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('AddNote')} style={styles.headerBtnWrap}>
          <Text style={styles.headerBtnTxt}>+ Add</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <ScreenContainer>
      <FlatList
        data={notes}
        keyExtractor={x => x.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState text="No notes yet." />}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('NoteDetail', { id: item.id })}>
            <AppCard>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.preview} numberOfLines={2}>
                {item.content}
              </Text>
              <Text style={styles.meta}>{item.createdAt}</Text>
            </AppCard>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: SPACING.md, gap: 12 },
  title: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  preview: { marginTop: 6, color: COLORS.text },
  meta: { marginTop: 8, color: COLORS.muted, fontSize: 12 },
  headerBtnWrap: { paddingHorizontal: 10, paddingVertical: 6 },
  headerBtnTxt: { color: 'white', fontWeight: '900' },
});
