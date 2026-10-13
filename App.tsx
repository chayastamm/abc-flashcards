import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Andika_700Bold, useFonts } from '@expo-google-fonts/andika';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// High-contrast primary toy palette.
const RED = '#FF4B4B';
const YELLOW = '#FFD166';
const GREEN = '#06D6A0';
const BLUE = '#118AB2';
const BACKGROUND = '#F8F9FA';
const INK = '#073B4C'; // dark text/outlines
const COLORS = [RED, YELLOW, GREEN, BLUE];

// White reads poorly on the light yellow and green, so those get dark ink.
const inkOn = (color: string) => (color === YELLOW || color === GREEN ? INK : '#fff');
// Keyed on the capital so "A" and "a" share a color.
const cardColor = (letter: string) => COLORS[letter.toUpperCase().charCodeAt(0) % COLORS.length];

type Screen = 'start' | 'play' | 'done';
type Mode = 'upper' | 'lower' | 'mixed';

const MODES: { mode: Mode; label: string; caption: string; color: string }[] = [
  { mode: 'upper', label: 'ABC', caption: 'Uppercase Letters', color: RED },
  { mode: 'lower', label: 'abc', caption: 'Lowercase Letters', color: BLUE },
  { mode: 'mixed', label: 'Aa', caption: 'Uppercase and Lowercase Letters', color: YELLOW },
];

function lettersFor(mode: Mode): string[] {
  const lower = ALPHABET.map((l) => l.toLowerCase());
  if (mode === 'upper') return ALPHABET;
  if (mode === 'lower') return lower;
  return [...ALPHABET, ...lower];
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Clock display for the play screen, e.g. "3:05".
function formatClock(ms: number): string {
  const secs = Math.floor(ms / 1000);
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
}

// Spoken-style duration for the finish screen, e.g. "3 minutes and 20 seconds".
function formatDuration(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;
  if (m === 0) return plural(s, 'second');
  if (s === 0) return plural(m, 'minute');
  return `${plural(m, 'minute')} and ${plural(s, 'second')}`;
}

export default function App() {
  // Andika is designed for early readers: distinct I/l and the a/g shapes kids learn to write.
  const [fontsLoaded] = useFonts({ Andika_700Bold });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Game />
    </SafeAreaProvider>
  );
}

function Game() {
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState<Screen>('start');
  const [mode, setMode] = useState<Mode>('upper');
  const [deck, setDeck] = useState<string[]>([]);
  // Timed mode is off each time the app opens; it isn't persisted.
  const [timed, setTimed] = useState(false);
  // On: missed cards go to the back of the deck. Off: each card shows once and the score is tallied.
  const [repeatMisses, setRepeatMisses] = useState(true);
  // The letters in this round, in alphabet order, and the ones missed when misses don't repeat.
  const [round, setRound] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Plays the full deck for the mode, or just the given letters (e.g. a retry of missed ones).
  const start = (m: Mode, letters = lettersFor(m)) => {
    setMode(m);
    setRound(letters);
    setDeck(shuffle(letters));
    setMissed([]);
    setStartedAt(Date.now());
    setScreen('play');
  };

  // Remove the top card, finishing the round if it was the last.
  const advance = () => {
    const rest = deck.slice(1);
    if (rest.length === 0) {
      setElapsed(Date.now() - startedAt);
      setScreen('done');
    }
    setDeck(rest);
  };

  // Check: card is learned, remove it from the deck.
  const onCheck = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    advance();
  };

  // X: send the card to the back of the deck so it repeats, or move on if repeats are off.
  const onSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!repeatMisses) {
      setMissed([...missed, deck[0]]);
      advance();
      return;
    }
    const [first, ...rest] = deck;
    setDeck([...rest, first]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {screen === 'start' && (
        <StartScreen
          onStart={start}
          timed={timed}
          onToggleTimed={setTimed}
          repeatMisses={repeatMisses}
          onToggleRepeatMisses={setRepeatMisses}
        />
      )}
      {screen === 'play' && deck.length > 0 && (
        <PlayScreen
          deck={deck}
          total={round.length}
          startedAt={timed ? startedAt : null}
          onCheck={onCheck}
          onSkip={onSkip}
          onHome={() => setScreen('start')}
        />
      )}
      {screen === 'done' && (
        <DoneScreen
          round={round}
          allLetters={lettersFor(mode)}
          missed={repeatMisses ? null : missed}
          elapsed={timed ? elapsed : null}
          onRestart={() => start(mode)}
          onRetryMissed={() => start(mode, round.filter((l) => missed.includes(l)))}
          onHome={() => setScreen('start')}
        />
      )}
    </View>
  );
}

function StartScreen({
  onStart,
  timed,
  onToggleTimed,
  repeatMisses,
  onToggleRepeatMisses,
}: {
  onStart: (mode: Mode) => void;
  timed: boolean;
  onToggleTimed: (timed: boolean) => void;
  repeatMisses: boolean;
  onToggleRepeatMisses: (repeatMisses: boolean) => void;
}) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.center}>
      <Text style={styles.welcome}>WELCOME!</Text>
      <Text style={styles.subtitle}>Select a deck of flashcards to begin.</Text>
      <Animated.Image
        source={require('./assets/abc-logo.png')}
        resizeMode="contain"
        style={[styles.logo, { transform: [{ scale: pulse }] }]}
      />
      <View style={styles.modeRow}>
        {MODES.map(({ mode, label, caption, color }) => (
          <Pressable
            key={mode}
            onPress={() => onStart(mode)}
            accessibilityRole="button"
            accessibilityLabel={caption}
            style={({ pressed }) => [styles.modeButton, { backgroundColor: color }, pressed && styles.pressed]}
          >
            <Text style={[styles.modeLabel, { color: inkOn(color) }]}>{label}</Text>
            <Text style={[styles.modeCaption, { color: inkOn(color) }]}>{caption}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.timedRow}>
        <Ionicons name="stopwatch" size={28} color={INK} />
        <Text style={styles.timedLabel} onPress={() => onToggleTimed(!timed)}>
          Timed Mode
        </Text>
        <Switch
          value={timed}
          onValueChange={onToggleTimed}
          accessibilityLabel="Timed mode"
          trackColor={{ false: '#CED4DA', true: GREEN }}
          thumbColor="#fff"
        />
      </View>
      <View style={styles.toggleRow}>
        <Ionicons name="repeat" size={28} color={INK} />
        <Text style={styles.timedLabel} onPress={() => onToggleRepeatMisses(!repeatMisses)}>
          Repeat Missed Letters
        </Text>
        <Switch
          value={repeatMisses}
          onValueChange={onToggleRepeatMisses}
          accessibilityLabel="Repeat missed letters"
          trackColor={{ false: '#CED4DA', true: GREEN }}
          thumbColor="#fff"
        />
      </View>
    </View>
  );
}

// Ticks on its own so the rest of the play screen doesn't re-render every second.
function Timer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.timer} accessibilityLabel={`Time: ${formatDuration(now - startedAt)}`}>
      <Ionicons name="stopwatch" size={22} color={INK} />
      <Text style={styles.timerText}>{formatClock(now - startedAt)}</Text>
    </View>
  );
}

function PlayScreen({
  deck,
  total,
  startedAt,
  onCheck,
  onSkip,
  onHome,
}: {
  deck: string[];
  total: number;
  startedAt: number | null;
  onCheck: () => void;
  onSkip: () => void;
  onHome: () => void;
}) {
  const letter = deck[0];
  const color = cardColor(letter);
  const learned = total - deck.length;
  const pop = useRef(new Animated.Value(0)).current;

  // Fit the card between the header and footer buttons on any screen size.
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const available = height - insets.top - insets.bottom - 80 - 200;
  const cardWidth = Math.min(width * 0.85, 360, available * 0.9 * 0.72);
  const cardHeight = cardWidth / 0.72;

  // Animate each new card in. Keyed on the deck array (new on every tap), so a lone repeated card still animates.
  useEffect(() => {
    pop.setValue(0);
    Animated.spring(pop, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }).start();
  }, [deck, pop]);

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <Pressable onPress={onHome} hitSlop={12} accessibilityLabel="Home">
            <Ionicons name="home" size={30} color={INK} />
          </Pressable>
        </View>
        <Text style={styles.progress}>
          {learned + 1} / {total}
        </Text>
        <View style={[styles.headerSide, styles.headerRight]}>
          {startedAt !== null && <Timer startedAt={startedAt} />}
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(learned / total) * 100}%` }]} />
      </View>

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.card,
            {
              width: cardWidth,
              height: cardHeight,
              backgroundColor: color,
              opacity: pop,
              transform: [
                { scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                { rotate: pop.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '0deg'] }) },
              ],
            },
          ]}
        >
          <Text
            style={[
              styles.cardLetter,
              { color: inkOn(color), fontSize: cardWidth * 0.85, lineHeight: cardWidth * 1.15 },
            ]}
          >
            {letter}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={[styles.footerLabel, { color: RED }]}>Try Again!</Text>
          <Pressable
            onPress={onSkip}
            accessibilityLabel="Try again"
            style={({ pressed }) => [styles.footerButton, styles.skip, pressed && styles.pressed]}
          >
            <Ionicons name="close" size={56} color="#fff" />
          </Pressable>
        </View>
        <View style={styles.footerItem}>
          <Text style={[styles.footerLabel, { color: INK }]}>Got it!</Text>
          <Pressable
            onPress={onCheck}
            accessibilityLabel="Got it"
            style={({ pressed }) => [styles.footerButton, styles.check, pressed && styles.pressed]}
          >
            <Ionicons name="checkmark" size={56} color={inkOn(GREEN)} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function DoneScreen({
  round,
  allLetters,
  missed,
  elapsed,
  onRestart,
  onRetryMissed,
  onHome,
}: {
  round: string[];
  // The mode's full deck. On a retry round, letters outside it were already right in an earlier round.
  allLetters: string[];
  // Null when misses repeat, since every letter ends up correct.
  missed: string[] | null;
  elapsed: number | null;
  onRestart: () => void;
  onRetryMissed: () => void;
  onHome: () => void;
}) {
  const total = round.length;
  const hasMisses = missed !== null && missed.length > 0;
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.spring(bounce, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }).start();
  }, [bounce]);

  return (
    <View style={styles.flex}>
      <Confetti />
      <ScrollView contentContainerStyle={styles.doneContent}>
        <Animated.Text
          style={[
            styles.trophy,
            hasMisses && styles.trophySmall,
            { transform: [{ scale: bounce.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }] },
          ]}
        >
          🏆
        </Animated.Text>
        <Text style={styles.doneTitle}>Great job!</Text>
        <Text style={styles.doneSubtitle}>
          {missed === null
            ? `You did all ${total} letters!`
            : `You got ${total - missed.length}/${total} right!`}
        </Text>
        {elapsed !== null && (
          <Text style={styles.doneTime}>You finished in {formatDuration(elapsed)}!</Text>
        )}
        {hasMisses && (
          <>
            <View style={styles.results}>
              {allLetters.map((letter) => {
                const wrong = missed.includes(letter);
                return (
                  <View
                    key={letter}
                    accessibilityLabel={`${letter}, ${wrong ? 'wrong' : 'right'}`}
                    style={[styles.resultChip, { backgroundColor: wrong ? RED : GREEN }]}
                  >
                    <Text style={[styles.resultLetter, { color: inkOn(wrong ? RED : GREEN) }]}>{letter}</Text>
                    <Ionicons name={wrong ? 'close' : 'checkmark'} size={16} color={inkOn(wrong ? RED : GREEN)} />
                  </View>
                );
              })}
            </View>
            <Pressable
              onPress={onRetryMissed}
              accessibilityRole="button"
              style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
            >
              <Ionicons name="repeat" size={28} color="#fff" />
              <Text style={styles.retryLabel}>Practice the {missed.length} I missed</Text>
            </Pressable>
          </>
        )}
        <View style={styles.doneButtons}>
          <Pressable
            onPress={onHome}
            accessibilityLabel="Home"
            style={({ pressed }) => [styles.restartButton, styles.homeButton, pressed && styles.pressed]}
          >
            <Ionicons name="home" size={44} color={inkOn(YELLOW)} />
          </Pressable>
          <Pressable
            onPress={onRestart}
            accessibilityLabel="Play again"
            style={({ pressed }) => [styles.restartButton, pressed && styles.pressed]}
          >
            <Ionicons name="refresh" size={52} color="#fff" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const CONFETTI_COUNT = 60;

function Confetti() {
  const { width, height } = useWindowDimensions();
  const pieces = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        x: Math.random() * width,
        drift: (Math.random() - 0.5) * 120,
        size: 8 + Math.random() * 10,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 1500,
        duration: 2500 + Math.random() * 2000,
        spin: Math.random() > 0.5 ? 1 : -1,
        anim: new Animated.Value(0),
      })),
    [width],
  );

  useEffect(() => {
    const loops = pieces.map((p) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.timing(p.anim, {
            toValue: 1,
            duration: p.duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [pieces]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: -20,
            width: p.size,
            height: p.size * 1.6,
            borderRadius: 2,
            backgroundColor: p.color,
            transform: [
              { translateY: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, height + 40] }) },
              { translateX: p.anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, p.drift, 0] }) },
              {
                rotate: p.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', `${p.spin * 720}deg`],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BACKGROUND },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.95 }] },

  welcome: { fontSize: 54, fontWeight: '900', color: RED, letterSpacing: 2 },
  subtitle: { fontSize: 18, fontWeight: '700', color: INK, textAlign: 'center', marginTop: 8, marginBottom: 32 },
  logo: { width: 280, height: 160 },
  modeRow: { flexDirection: 'row', width: '100%', maxWidth: 460, gap: 10, marginTop: 36 },
  modeButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 6,
  },
  modeLabel: { fontSize: 32, fontFamily: 'Andika_700Bold' },
  modeCaption: { fontSize: 15, fontWeight: '800', textAlign: 'center', marginTop: 4 },
  timedRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 32 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  timedLabel: { fontSize: 20, fontWeight: '800', color: INK },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerSide: { flex: 1 },
  headerRight: { alignItems: 'flex-end' },
  progress: { fontSize: 22, fontWeight: '800', color: INK },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timerText: { fontSize: 22, fontWeight: '800', color: INK, fontVariant: ['tabular-nums'] },
  progressTrack: {
    height: 10,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 5,
    backgroundColor: '#E2E6EA',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: GREEN, borderRadius: 5 },

  card: {
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    borderWidth: 4,
    borderColor: INK,
  },
  cardLetter: { fontFamily: 'Andika_700Bold', includeFontPadding: false },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footerItem: { alignItems: 'center' },
  footerLabel: { fontSize: 22, fontWeight: '900', marginBottom: 8 },
  footerButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  skip: { backgroundColor: RED },
  check: { backgroundColor: GREEN },

  doneContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  trophy: { fontSize: 140 },
  trophySmall: { fontSize: 80 },
  results: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    maxWidth: 460,
    marginTop: 24,
  },
  resultChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  resultLetter: { fontSize: 22, fontFamily: 'Andika_700Bold' },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 32,
    backgroundColor: RED,
    elevation: 6,
  },
  retryLabel: { fontSize: 20, fontWeight: '900', color: '#fff' },
  doneTitle: { fontSize: 44, fontWeight: '900', color: RED, marginTop: 8 },
  doneSubtitle: { fontSize: 22, fontWeight: '700', color: INK, marginTop: 8 },
  doneTime: { fontSize: 22, fontWeight: '800', color: BLUE, marginTop: 8, textAlign: 'center' },
  doneButtons: { flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 40 },
  homeButton: { width: 90, height: 90, backgroundColor: YELLOW },
  restartButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
