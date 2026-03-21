import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Defs,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  cancelAnimation,
  interpolate,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface NucleusProps {
  score: number;
  onPress: () => void;
  onLongPress: () => void;
  status: 'forte' | 'fraco';
}

const SIZE = 340;
const CX = SIZE / 2;
const CY = SIZE / 2;

// Generates an SVG cubic bezier path for a wavy tendril from center outward
function makeTendrilPath(
  angle: number,
  length: number,
  wave: number,
  phase: number
): string {
  const rad = (angle * Math.PI) / 180;
  const perpRad = rad + Math.PI / 2;

  const cp1x = CX + Math.cos(rad) * length * 0.3 + Math.cos(perpRad) * wave * Math.sin(phase);
  const cp1y = CY + Math.sin(rad) * length * 0.3 + Math.sin(perpRad) * wave * Math.sin(phase);
  const cp2x = CX + Math.cos(rad) * length * 0.7 + Math.cos(perpRad) * wave * Math.cos(phase + 1);
  const cp2y = CY + Math.sin(rad) * length * 0.7 + Math.sin(perpRad) * wave * Math.cos(phase + 1);
  const ex = CX + Math.cos(rad) * length;
  const ey = CY + Math.sin(rad) * length;

  return `M ${CX} ${CY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`;
}

const TENDRIL_COUNT = 14;
const TENDRIL_ANGLES = Array.from({ length: TENDRIL_COUNT }, (_, i) =>
  (360 / TENDRIL_COUNT) * i + (i % 2 === 0 ? 8 : -5)
);
const TENDRIL_LENGTHS = Array.from({ length: TENDRIL_COUNT }, (_, i) =>
  110 + (i % 3) * 15 + (i % 5) * 8
);

// One animated tendril
const Tendril: React.FC<{
  angle: number;
  baseLength: number;
  waveAmp: number;
  phaseOffset: number;
  colorStop: string;
  breathVal: Animated.SharedValue<number>;
  waveVal: Animated.SharedValue<number>;
}> = ({ angle, baseLength, waveAmp, phaseOffset, colorStop, breathVal, waveVal }) => {
  const animatedProps = useAnimatedProps(() => {
    const wave = waveAmp * (0.5 + 0.5 * breathVal.value);
    const phase = waveVal.value + phaseOffset;
    const len = baseLength * (0.85 + 0.15 * breathVal.value);
    return {
      d: makeTendrilPath(angle, len, wave, phase),
      strokeOpacity: interpolate(breathVal.value, [0, 1], [0.15, 0.55]),
    };
  });

  return (
    <AnimatedPath
      animatedProps={animatedProps}
      stroke={colorStop}
      strokeWidth={1.2}
      fill="none"
      strokeLinecap="round"
    />
  );
};

// Orbiting particle
const Particle: React.FC<{
  radiusX: number;
  radiusY: number;
  rotOffset: number;
  orbitVal: Animated.SharedValue<number>;
  color: string;
  size: number;
}> = ({ radiusX, radiusY, rotOffset, orbitVal, color, size }) => {
  const animatedProps = useAnimatedProps(() => {
    const t = (orbitVal.value + rotOffset) % (2 * Math.PI);
    return {
      cx: CX + Math.cos(t) * radiusX,
      cy: CY + Math.sin(t) * radiusY,
      r: size * (0.7 + 0.3 * Math.abs(Math.sin(t * 2))),
      fillOpacity: interpolate(Math.abs(Math.sin(t)), [0, 1], [0.2, 0.9]),
    };
  });

  return <AnimatedCircle animatedProps={animatedProps} fill={color} />;
};

export const Nucleus: React.FC<NucleusProps> = ({ score, onPress, onLongPress, status }) => {
  // Shared animation values
  const breathVal = useSharedValue(0); // 0 → 1, drives breathing
  const waveVal = useSharedValue(0);    // 0 → 2π, drives tendril waves
  const orbitVal = useSharedValue(0);   // 0 → 2π, drives particle orbits
  const pulseVal = useSharedValue(0);   // 0 → 1, drives outer ring pulse
  const innerGlow = useSharedValue(0);

  const vitalitySpeed = status === 'forte' ? 1.4 : 0.75;
  const breathDur = 3500 / vitalitySpeed;
  const orbitDur = 12000 / vitalitySpeed;

  useEffect(() => {
    // Core breathing
    breathVal.value = withRepeat(
      withSequence(
        withTiming(1, { duration: breathDur, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: breathDur * 1.3, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Continuously rotating wave phase for tendrils
    waveVal.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 8000 / vitalitySpeed, easing: Easing.linear }),
      -1,
      false
    );

    // Particle orbital motion
    orbitVal.value = withRepeat(
      withTiming(Math.PI * 2, { duration: orbitDur, easing: Easing.linear }),
      -1,
      false
    );

    // Outer pulse ring
    pulseVal.value = withRepeat(
      withSequence(
        withTiming(1, { duration: breathDur * 0.8, easing: Easing.out(Easing.sin) }),
        withTiming(0, { duration: breathDur * 1.5, easing: Easing.in(Easing.sin) })
      ),
      -1,
      false
    );

    // Inner glow flicker
    innerGlow.value = withRepeat(
      withSequence(
        withDelay(200, withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })),
        withTiming(0.6, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: breathDur, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(breathVal);
      cancelAnimation(waveVal);
      cancelAnimation(orbitVal);
      cancelAnimation(pulseVal);
      cancelAnimation(innerGlow);
    };
  }, [vitalitySpeed]);

  // Core nucleus morph
  const coreProps = useAnimatedProps(() => ({
    r: interpolate(breathVal.value, [0, 1], [42, 52]),
    fillOpacity: interpolate(breathVal.value, [0, 1], [0.88, 1]),
  }));

  // Middle membrane
  const membraneProps = useAnimatedProps(() => ({
    r: interpolate(breathVal.value, [0, 1], [62, 78]),
    fillOpacity: interpolate(breathVal.value, [0, 1], [0.25, 0.45]),
  }));

  // Outer gossamer shell
  const outerProps = useAnimatedProps(() => ({
    rx: interpolate(breathVal.value, [0, 1], [88, 105]),
    ry: interpolate(breathVal.value, [0, 1], [82, 100]),
    fillOpacity: interpolate(breathVal.value, [0, 1], [0.06, 0.14]),
  }));

  // Pulse ring
  const pulseRingProps = useAnimatedProps(() => ({
    r: interpolate(pulseVal.value, [0, 1], [90, 140]),
    strokeOpacity: interpolate(pulseVal.value, [0, 1], [0.35, 0]),
    strokeWidth: interpolate(pulseVal.value, [0, 1], [2.5, 0.5]),
  }));

  // Second offset pulse ring
  const pulseRing2Props = useAnimatedProps(() => ({
    r: interpolate(pulseVal.value, [0, 1], [68, 120]),
    strokeOpacity: interpolate(pulseVal.value, [0, 1], [0.2, 0]),
    strokeWidth: interpolate(pulseVal.value, [0, 1], [1.5, 0.3]),
  }));

  // Inner glow halo
  const innerGlowProps = useAnimatedProps(() => ({
    r: interpolate(innerGlow.value, [0, 1], [28, 36]),
    fillOpacity: interpolate(innerGlow.value, [0, 1], [0.4, 0.85]),
  }));

  // Score-aware color tint (maps score to cyan→green spectrum)
  const scoreFraction = Math.min(Math.max((score - 60) / 40, 0), 1);
  const coreColor = status === 'forte'
    ? 'rgba(0, 200, 255, 1)'
    : 'rgba(0, 140, 200, 1)';
  const accentColor = status === 'forte'
    ? 'rgba(80, 255, 200, 1)'
    : 'rgba(40, 160, 180, 1)';

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} onLongPress={onLongPress} delayLongPress={500}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <RadialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <Stop offset="30%" stopColor={coreColor} stopOpacity="0.9" />
              <Stop offset="70%" stopColor="#0040aa" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="#001033" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="membraneGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={coreColor} stopOpacity="0.5" />
              <Stop offset="60%" stopColor="#0055cc" stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#0010aa" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="outerGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={coreColor} stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#003399" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="innerGlowGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <Stop offset="60%" stopColor={coreColor} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={coreColor} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {TENDRIL_ANGLES.map((angle, i) => (
            <Tendril
              key={"tendril-" + i}
              angle={angle}
              baseLength={TENDRIL_LENGTHS[i]}
              waveAmp={14 + (i % 4) * 6}
              phaseOffset={(i * Math.PI * 2) / TENDRIL_COUNT}
              colorStop={i % 3 === 0 ? accentColor : coreColor}
              breathVal={breathVal}
              waveVal={waveVal}
            />
          ))}

          <AnimatedCircle animatedProps={pulseRingProps} cx={CX} cy={CY} stroke={coreColor} fill="none" />
          <AnimatedCircle animatedProps={pulseRing2Props} cx={CX} cy={CY} stroke={accentColor} fill="none" />
          <AnimatedEllipse animatedProps={outerProps} cx={CX} cy={CY} fill="url(#outerGrad)" />

          <Particle radiusX={95}  radiusY={75}  rotOffset={0}            orbitVal={orbitVal} color={accentColor} size={3.5} />
          <Particle radiusX={88}  radiusY={82}  rotOffset={Math.PI*0.7}  orbitVal={orbitVal} color={coreColor}   size={2.5} />
          <Particle radiusX={105} radiusY={68}  rotOffset={Math.PI*1.3}  orbitVal={orbitVal} color="#ffffff"     size={2} />
          <Particle radiusX={80}  radiusY={90}  rotOffset={Math.PI*0.4}  orbitVal={orbitVal} color={accentColor} size={1.8} />
          <Particle radiusX={72}  radiusY={100} rotOffset={Math.PI*1.8}  orbitVal={orbitVal} color={coreColor}   size={2.2} />

          <AnimatedCircle animatedProps={membraneProps} cx={CX} cy={CY} fill="url(#membraneGrad)" />
          <AnimatedCircle animatedProps={coreProps} cx={CX} cy={CY} fill="url(#coreGrad)" />
          <AnimatedCircle animatedProps={innerGlowProps} cx={CX} cy={CY} fill="url(#innerGlowGrad)" />
        </Svg>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
