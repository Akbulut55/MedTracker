import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { EmptyState } from '../../components/ui/EmptyState';
import { confirmAction, showSuccess } from '../../utils/feedback';

type Props = NativeStackScreenProps<AppStackParamList, 'Reminders'>;

export function RemindersScreen({ navigation }: Props) {
  const { reminders, deleteReminder } = useData();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('AddReminder')} style={styles.headerBtnWrap}>
          <Text style={styles.headerBtnTxt}>+ Add</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <ScreenContainer>
      <FlatList
        data={reminders}
        keyExtractor={x => x.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState text="No reminders yet." />}
        renderItem={({ item }) => (
          <AppCard>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.sub}>{item.detail}</Text>
            <Text style={styles.meta}>{item.module} | {item.createdAt}</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <AppButton title="Edit" variant="secondary" onPress={() => navigation.navigate('EditReminder', { id: item.id })} />
              </View>
              <View style={styles.col}>
                <AppButton
                  title="Delete"
                  variant="danger"
                  onPress={() =>
                    confirmAction('Delete reminder', `${item.title} silinsin mi?`, () => {
                      deleteReminder(item.id);
                      showSuccess('Reminder deleted.');
                    })
                  }
                />
              </View>
            </View>
          </AppCard>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: SPACING.md, gap: 12 },
  title: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  sub: { marginTop: 6, color: COLORS.text },
  meta: { marginTop: 8, color: COLORS.muted, fontSize: 12 },
  row: { marginTop: 10, flexDirection: 'row', gap: 10 },
  col: { flex: 1 },
  headerBtnWrap: { paddingHorizontal: 10, paddingVertical: 6 },
  headerBtnTxt: { color: 'white', fontWeight: '900' },
});
