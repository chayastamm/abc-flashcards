import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Andika_700Bold, useFonts } from '@expo-google-fonts/andika';
import { Game } from './src/Game';

export default function App() {
  const [areFontsLoaded] = useFonts({ Andika_700Bold });
  if (!areFontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Game />
    </SafeAreaProvider>
  );
}
