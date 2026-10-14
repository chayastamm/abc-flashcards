import { useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { getPressedGlowStyle } from '../styles/common.styles';

// A quick tap lasts well under this, so the glow would otherwise flash by unseen.
const MIN_GLOW_DURATION_MS = 150;

// A Pressable that glows in its own color when tapped. The glow stays up for at least MIN_GLOW_DURATION_MS,
// and onPress runs once it has been seen, so the feedback shows even when the press changes the screen.
export function GlowPressable({
  glowColor,
  style,
  onPress,
  onPressIn,
  onPressOut,
  ...pressableProps
}: Omit<PressableProps, 'style'> & {
  glowColor: string;
  style?: StyleProp<ViewStyle>;
}) {
  const [isGlowing, setIsGlowing] = useState(false);
  const pressStartTime = useRef(0);
  const pendingTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  // The delayed call uses the latest onPress, so back-to-back taps each act on the current state.
  const latestOnPress = useRef(onPress);

  useEffect(() => {
    latestOnPress.current = onPress;
  }, [onPress]);

  useEffect(() => {
    const timeouts = pendingTimeouts.current;
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const runAfterMinGlow = (callback: () => void) => {
    const remainingMs = Math.max(0, MIN_GLOW_DURATION_MS - (Date.now() - pressStartTime.current));
    pendingTimeouts.current.push(setTimeout(callback, remainingMs));
  };

  const handlePressIn = (event: GestureResponderEvent) => {
    pressStartTime.current = Date.now();
    setIsGlowing(true);
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    runAfterMinGlow(() => setIsGlowing(false));
    onPressOut?.(event);
  };

  const handlePress = (event: GestureResponderEvent) => {
    runAfterMinGlow(() => latestOnPress.current?.(event));
  };

  return (
    <Pressable
      {...pressableProps}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[style, isGlowing && getPressedGlowStyle(glowColor)]}
    />
  );
}
