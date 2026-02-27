import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'InfoShare'>;

export function InfoTopicsScreen({ navigation }: Props) {
  const { topics } = useData();

  return (
    <View style={styles.root}>
      <FlatList
        data={topics}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ padding: SPACING.md, gap: 12 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('TopicDetail', { id: item.id })}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>💬 {item.comments.length} • ❤️ {item.likes}</Text>
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
  meta: { marginTop: 8, color: COLORS.muted, fontSize: 12, fontWeight: '800' },
});