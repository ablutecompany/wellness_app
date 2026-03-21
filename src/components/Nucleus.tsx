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
import { Image, ImageStyle } from 'react-native';

interface NucleusProps {
  score: number;
  onPress: () => void;
  onLongPress: () => void;
  status: 'forte' | 'fraco';
}

export const Nucleus: React.FC<NucleusProps> = ({ score, onPress, onLongPress, status }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(status === 'forte' ? 1.08 : 1.03, { 
        duration: 2500,
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    );
    
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.7, { duration: 1500 })
      ),
      -1,
      true
    );

    rotate.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
  }, [status]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Pressable 
        onPress={onPress} 
        onLongPress={onLongPress}
        delayLongPress={500}
      >
        <Animated.View style={[styles.nucleusContainer, animatedStyle]}>
          <Image 
            source={{ uri: 'file:///C:/Users/nunom/.gemini/antigravity/brain/e1a5a01b-fea5-47c4-96cd-3810a89ce9f9/ai_intelligence_nucleus_1774107306302.png' }}
            style={styles.aiImage as ImageStyle}
            resizeMode="contain"
          />
          <Animated.View style={styles.scoreOverlay}>
            <Typography variant="h1" style={styles.scoreText}>
              {score}
            </Typography>
          </Animated.View>
        </Animated.View>
      </Pressable>
      
      <Typography variant="caption" style={styles.tapTip}>
        HOLD para BIOMETRIA
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nucleusContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiImage: {
    width: 200,
    height: 200,
    position: 'absolute',
  },
  scoreOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 56,
    fontWeight: '800',
    color: theme.colors.text,
    textShadowColor: 'rgba(0, 217, 126, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  tapTip: {
    marginTop: 10,
    letterSpacing: 2,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  }
});
