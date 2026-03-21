import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, Animated as RNAnimated } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  interpolate,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { theme } from '../theme';
import { Typography } from './Base';

interface NucleusProps {
  score: number;
  onPress: () => void;
  onLongPress: () => void;
  status: 'forte' | 'fraco';
}

export const Nucleus: React.FC<NucleusProps> = ({ score, onPress, onLongPress, status }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(status === 'forte' ? 1 : 0.4);
  const blur = useSharedValue(status === 'forte' ? 20 : 5);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(status === 'forte' ? 1.1 : 1.02, { 
        duration: status === 'forte' ? 2000 : 4000,
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    );
    
    opacity.value = withTiming(status === 'forte' ? 1 : 0.4, { duration: 1000 });
  }, [status]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      shadowRadius: status === 'forte' ? 30 : 10,
      shadowOpacity: status === 'forte' ? 0.8 : 0.3,
    };
  });

  return (
    <View style={styles.container}>
      <Pressable 
        onPress={onPress} 
        onLongPress={onLongPress}
        delayLongPress={500}
        style={({ pressed }) => [
          styles.pressable,
          pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }
        ]}
      >
        <Animated.View style={[
          styles.outerCircle, 
          animatedStyle,
          { borderColor: status === 'forte' ? theme.colors.success : theme.colors.textMuted }
        ]}>
          <View style={[
            styles.innerCircle,
            { backgroundColor: status === 'forte' ? theme.colors.success : theme.colors.card }
          ]}>
            <Typography variant="h1" style={styles.scoreText}>
              {score}
            </Typography>
            <Typography variant="caption" style={{ color: theme.colors.textMuted }}>
              Score Global
            </Typography>
          </View>
        </Animated.View>
        
        {status === 'forte' && (
          <Animated.View style={[styles.glow, animatedStyle]} />
        )}
      </Pressable>
      
      <Typography variant="caption" style={styles.tapTip}>
        TAP para análise (NFC)
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.xl,
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.success,
    elevation: 20,
    backgroundColor: 'transparent',
  },
  innerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scoreText: {
    fontSize: 64,
    fontWeight: '800',
    color: theme.colors.background,
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.colors.success,
    zIndex: -1,
    opacity: 0.2,
  },
  tapTip: {
    marginTop: theme.spacing.md,
    letterSpacing: 1,
    textTransform: 'uppercase',
  }
});
