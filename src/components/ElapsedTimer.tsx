import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { elapsedTimerStyles } from '../styles/elapsedTimer.styles';
import { formatElapsedClock, formatElapsedDuration } from '../utils';

const TICK_INTERVAL_MS = 250;

// Ticks on its own so the rest of the play screen doesn't re-render every second.
export function ElapsedTimer({ roundStartTime }: { roundStartTime: number }) {
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(Date.now()), TICK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const elapsedMs = currentTime - roundStartTime;

  return (
    <View style={elapsedTimerStyles.container} accessibilityLabel={`Time: ${formatElapsedDuration(elapsedMs)}`}>
      <Ionicons name="stopwatch" size={22} color={COLORS.ink} />
      <Text style={elapsedTimerStyles.text}>{formatElapsedClock(elapsedMs)}</Text>
    </View>
  );
}
