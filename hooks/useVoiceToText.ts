import { useState, useEffect, useCallback } from 'react';
import { Platform, NativeModules } from 'react-native';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

export const useVoiceToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [partialTranscript, setPartialTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Voice is available and it's a native platform
    if (Platform.OS === 'web' || !Voice || !NativeModules.Voice) {
      return;
    }

    Voice.onSpeechStart = () => setIsRecording(true);
    Voice.onSpeechEnd = () => setIsRecording(false);
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setError(e.error?.message || 'Speech recognition error');
      setIsRecording(false);
    };
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setFinalTranscript(e.value[0]);
        setPartialTranscript('');
      }
    };
    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setPartialTranscript(e.value[0]);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = useCallback(async (locale = 'en-US') => {
    if (Platform.OS === 'web' || !Voice || !NativeModules.Voice) {
      setError('Voice recognition is not available on this platform or environment.');
      return;
    }

    try {
      setError(null);
      setFinalTranscript('');
      setPartialTranscript('');
      await Voice.start(locale);
    } catch (e) {
      setError('Failed to start voice recognition');
      console.error(e);
    }
  }, []);

  const stopListening = useCallback(async () => {
    if (!Voice) return;
    try {
      await Voice.stop();
    } catch (e) {
      setError('Failed to stop voice recognition');
      console.error(e);
    }
  }, []);

  const isAvailable = Platform.OS !== 'web' && !!NativeModules.Voice;

  return {
    isRecording,
    partialTranscript,
    finalTranscript,
    error,
    startListening,
    stopListening,
    isAvailable,
  };
};
