import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../state/AuthContext';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Ratings'>;

export function RatingsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { addRating } = useData();
  const [stars, setStars] = useState(5);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        user?.role === 'ADMIN' ? (
          <Pressable onPress={() => navigation.navigate('AdminRatings')} style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
            <Text style={{ color: 'white', fontWeight: '900' }}>List</Text>
          </Pressable>
        ) : null,
    });
  }, [navigation, user]);

  const items = useMemo(() => [1, 2, 3, 4, 5], []);

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.h}>Rate the app</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          {items.map(i => (
            <Pressable key={i} onPress={() => setStars(i)} style={{ padding: 8 }}>
              <Text style={{ fontSize: 34 }}>{i <= stars ? '★' : '☆'}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.btn}
          onPress={() => addRating(user?.username ?? 'user', stars)}
        >
          <Text style={styles.btnTxt}>SAVE</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, padding: SPACING.md },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14, alignItems: 'center' },
  h: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  btn: { marginTop: 14, backgroundColor: COLORS.brand, paddingVertical: 12, borderRadius: 12, alignItems: 'center', width: '100%' },
  btnTxt: { color: 'white', fontWeight: '900' },
});