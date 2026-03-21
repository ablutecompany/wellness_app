import React, { useRef, useMemo } from 'react';
import { StyleSheet, View, Dimensions, FlatList, ListRenderItem, Platform } from 'react-native';
import { theme } from '../theme';
import { Typography } from './Base';
import { Nucleus } from './Nucleus';
import { BlurView } from 'expo-blur';
import { Zap, Activity } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const CAROUSEL_WIDTH = width;

export const THEMES_DATA = [
  { id: '1', title: 'Performance', score: 88, insight: 'Máxima eficiência', color: theme.colors.biologicalBlue },
  { id: '2', title: 'Recuperação', score: 78, insight: 'Descanso recomendado', color: theme.colors.biologicalBlue },
  { id: '3', title: 'Energia', score: 91, insight: 'Pico de vitalidade', color: theme.colors.wellnessGreen },
  { id: '4', title: 'Prontidão funcional', score: 85, insight: 'Pronto para esforço', color: theme.colors.wellnessGreen },
  { id: '5', title: 'Resistência', score: 82, insight: 'Capacidade estável', color: theme.colors.biologicalBlue },
  { id: '6', title: 'Construção muscular', score: 74, insight: 'Síntese ativa', color: theme.colors.warning },
  { id: '7', title: 'Composição corporal', score: 89, insight: 'Rácio otimizado', color: theme.colors.biologicalBlue },
  { id: '8', title: 'Sono', score: 95, insight: 'Restauração total', color: theme.colors.wellnessGreen },
  { id: '9', title: 'Foco e clareza mental', score: 86, insight: 'Alta cognição', color: theme.colors.biologicalBlue },
  { id: '10', title: 'Vitalidade', score: 90, insight: 'Níveis perfeitos', color: theme.colors.wellnessGreen },
  { id: '11', title: 'Resiliência ao stress', score: 65, insight: 'Picos detetados', color: theme.colors.error },
  { id: '12', title: 'Bem-estar funcional', score: 84, insight: 'Equilíbrio mantido', color: theme.colors.biologicalBlue },
];

export interface ThemesCarouselProps {
  globalScore: number;
  isMeasuring: boolean;
  onNfcTap: () => void;
  onLongPress: () => void;
}

// Fallback for BlurView on unsupported environments
const GlassCard: React.FC<{ style?: any, children: React.ReactNode }> = ({ style, children }) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.glassCardBase, style, { backgroundColor: 'rgba(20, 25, 35, 0.45)', backdropFilter: 'blur(16px)' } as any]}>
        {children}
      </View>
    );
  }
  return (
    <BlurView intensity={40} tint="dark" style={[styles.glassCardBase, style]}>
      {children}
    </BlurView>
  );
};

const ThemeWidget: React.FC<{ themeItem: typeof THEMES_DATA[0] }> = ({ themeItem }) => (
  <View style={styles.widgetContent}>
    <View style={styles.cardHeader}>
      <View style={[styles.indicatorDot, { backgroundColor: themeItem.color }]} />
      <Typography variant="caption" style={{ color: theme.colors.textMuted, flexShrink: 1 }} numberOfLines={1}>MÉTRICA</Typography>
    </View>
    
    <View style={styles.scoreRow}>
      <Typography style={[styles.scoreLarge, { color: themeItem.color }]}>
        {themeItem.score}
      </Typography>
      <View style={styles.scoreBadge}>
         <Zap size={10} color={themeItem.color} />
      </View>
    </View>

    <Typography variant="h3" style={styles.themeTitle} numberOfLines={2}>
      {themeItem.title}
    </Typography>
    
    <View style={styles.insightBox}>
      <Activity size={10} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
      <Typography variant="caption" style={styles.insightText} numberOfLines={2}>
        {themeItem.insight}
      </Typography>
    </View>
  </View>
);

const OrbitalThemeNode: React.FC<{ leftTheme: typeof THEMES_DATA[0]; rightTheme: typeof THEMES_DATA[0] }> = ({ leftTheme, rightTheme }) => (
  <View style={styles.orbitalSlide}>
    
    {/* Left Side Glass Card: Theme A */}
    <GlassCard style={styles.leftCard}>
      <ThemeWidget themeItem={leftTheme} />
    </GlassCard>

    {/* Right Side Glass Card: Theme B */}
    <GlassCard style={styles.rightCard}>
      <ThemeWidget themeItem={rightTheme} />
    </GlassCard>

  </View>
);

type CarouselItem = 
  | { type: 'home'; id: string }
  | { type: 'theme_pair'; id: string; leftData: typeof THEMES_DATA[0]; rightData: typeof THEMES_DATA[0] };

export const ThemesCarousel: React.FC<ThemesCarouselProps> = ({ globalScore, isMeasuring, onNfcTap, onLongPress }) => {
  const flatListRef = useRef<FlatList>(null);

  const CHUNKED_PAIRS = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < THEMES_DATA.length; i += 2) {
      pairs.push([THEMES_DATA[i], THEMES_DATA[i + 1]]);
    }
    return pairs;
  }, []);

  const sequence: CarouselItem[] = [
    { type: 'home', id: 'home_base' },
    ...CHUNKED_PAIRS.map((pair, index) => ({ 
      type: 'theme_pair', 
      id: `theme_pair_${index}`, 
      leftData: pair[0], 
      rightData: pair[1] 
    } as CarouselItem))
  ];

  const LOOP_COUNT = 100;
  const data: CarouselItem[] = useMemo(() => {
    const list: CarouselItem[] = [];
    for (let i = 0; i < LOOP_COUNT; i++) {
      sequence.forEach(item => {
        list.push({ ...item, id: `${item.id}_${i}` }); 
      });
    }
    return list; // Forms a continuous ring Home -> Pair 1 -> ... -> Pair 6 -> Home -> ...
  }, [sequence]);

  const middleIndex = Math.floor(LOOP_COUNT / 2) * sequence.length;

  const renderItem: ListRenderItem<CarouselItem> = ({ item }) => {
    if (item.type === 'home') {
      return <View style={styles.slide} />;
    }

    return (
      <View style={styles.slide}>
        <OrbitalThemeNode leftTheme={item.leftData} rightTheme={item.rightData} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* Fixed Central Nucleus (Underneath the Carousel) */}
      <View style={styles.fixedNucleusContainer}>
        <Nucleus 
          score={globalScore} 
          status={isMeasuring ? 'forte' : 'fraco'} 
          onPress={onNfcTap}
          onLongPress={onLongPress}
        />
      </View>

      {/* Transparent Carousel that flows over the Nucleus */}
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CAROUSEL_WIDTH}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: CAROUSEL_WIDTH,
          offset: CAROUSEL_WIDTH * index,
          index,
        })}
        initialScrollIndex={middleIndex}
        windowSize={5}
        maxToRenderPerBatch={3}
        initialNumToRender={3}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
        style={styles.carouselOverlay}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 440,
    width: CAROUSEL_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedNucleusContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, 
  },
  carouselOverlay: {
    flex: 1,
    zIndex: 2, 
  },
  slide: {
    width: CAROUSEL_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitalSlide: {
    width: CAROUSEL_WIDTH,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm, // Bring slightly closer to edges
  },
  glassCardBase: {
    width: (CAROUSEL_WIDTH / 2) - 65, // Leaves ~130px in the middle for Nucleus
    minHeight: 180,
    borderRadius: 24,
    padding: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  leftCard: {
    marginLeft: 0,
    justifyContent: 'center',
  },
  rightCard: {
    marginRight: 0,
    justifyContent: 'center',
  },
  widgetContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  scoreLarge: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: -2,
    textShadowColor: 'rgba(255,255,255,0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    lineHeight: 52,
  },
  scoreBadge: {
    marginLeft: 4,
    marginTop: 6,
    padding: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  themeTitle: {
    fontSize: 14,
    color: theme.colors.text,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: theme.spacing.sm,
    borderRadius: 12,
  },
  insightText: {
    color: theme.colors.textMuted,
    lineHeight: 16,
    flex: 1,
    marginLeft: 2,
    fontSize: 11,
  }
});
