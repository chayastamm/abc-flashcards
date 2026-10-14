import { StyleSheet } from 'react-native';

export const CONFETTI_START_OFFSET = 20;

export const confettiStyles = StyleSheet.create({
  piece: { position: 'absolute', top: -CONFETTI_START_OFFSET, borderRadius: 2 },
});
