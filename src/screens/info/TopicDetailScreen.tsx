import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../state/AuthContext';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'TopicDetail'>;

export function TopicDetailScreen({ route }: Props) {
  const { user } = useAuth();
  const { topics, likeTopic, addComment } = useData();
  const topic = useMemo(() => topics.find(t => t.id === route.params.id), [topics, route.params.id]);
  const [text, setText] = useState('');

  if (!topic) return <View style={styles.root}><Text style={styles.empty}>Topic not found.</Text></View>;

  return (
    <View style={styles.root}>
      <View style={[styles.card, { margin: SPACING.md }]}>
        <Text style={styles.title}>{topic.title}</Text>
        <Pressable onPress={() => likeTopic(topic.id)} style={styles.likeBtn}>
          <Text style={{ color: 'white', fontWeight: '900' }}>Like ({topic.likes})</Text>
        </Pressable>
      </View>

      <FlatList
        data={topic.comments}
        keyExtractor={x => x.id}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: 12, paddingBottom: 90 }}
        ListEmptyComponent={<Text style={styles.empty}>No comments yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.meta}>{item.author} | {item.createdAt}</Text>
            <Text style={styles.body}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.composer}>
        <TextInput value={text} onChangeText={setText} placeholder="Write a comment..." style={styles.input} />
        <Pressable
          style={[styles.send, !text.trim() && { opacity: 0.6 }]}
          disabled={!text.trim()}
          onPress={() => {
            addComment(topic.id, user?.username ?? 'user', text.trim());
            setText('');
          }}
        >
          <Text style={{ color: 'white', fontWeight: '900' }}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  title: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  likeBtn: { marginTop: 10, backgroundColor: COLORS.brand, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  meta: { color: COLORS.muted, fontSize: 12, fontWeight: '800' },
  body: { marginTop: 6, color: COLORS.text },
  composer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
    flexDirection: 'row',
    gap: 10,
  },
  input: { flex: 1, backgroundColor: 'white', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  send: { backgroundColor: COLORS.brand, borderRadius: 12, paddingHorizontal: 14, justifyContent: 'center' },
  empty: { color: COLORS.muted, padding: SPACING.md },
});
