import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { Container, Typography } from '../components/Base';
import { theme } from '../theme';
import { useStore } from '../store/useStore';
import { BrandLogo } from '../components/BrandLogo';
import { ThemesCarousel } from '../components/ThemesCarousel';
import { Utensils, Zap, Map, Settings, Activity, ChevronUp, Moon, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { height } = Dimensions.get('window');

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // Metro cache bust
  const { globalScore, setGlobalScore, setIsMeasuring, isMeasuring } = useStore();

  // App Store Bottom Sheet Animation State
  const panY = useRef(new Animated.Value(height * 0.85)).current; // Start mostly hidden
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const resetPositionAnim = Animated.timing(panY, {
    toValue: height * 0.85,
    duration: 300,
    useNativeDriver: true,
  });

  const openPositionAnim = Animated.timing(panY, {
    toValue: height * 0.15, // Expand to 85% of screen
    duration: 300,
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }), // We'll handle this manually for limits if needed, but simple is fine
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy < -50 || gestureState.vy < -0.5) {
          setIsStoreOpen(true);
          openPositionAnim.start();
        } else if (gestureState.dy > 50 || gestureState.vy > 0.5) {
          setIsStoreOpen(false);
          resetPositionAnim.start();
        } else {
          // Revert to current state
          if (isStoreOpen) {
            openPositionAnim.start();
          } else {
            resetPositionAnim.start();
          }
        }
      },
    })
  ).current;
  
  const handleNfcTap = () => {
    console.log('NFC Analysis triggered');
  };

  const handleLongPress = async () => {
    setIsMeasuring(true);
    setTimeout(() => {
      setIsMeasuring(false);
      setGlobalScore(84);
      navigation.navigate('GlobalDetail');
    }, 4000);
  };

  return (
    <Container safe style={styles.container}>
      {/* Immersive Biological Atmosphere */}
      <View style={styles.atmosphere}>
        <LinearGradient 
          colors={['rgba(0, 85, 255, 0.15)', 'transparent']}
          style={[styles.glowBall, { top: -100, left: -100 }]}
        />
        <LinearGradient 
          colors={['rgba(0, 168, 107, 0.1)', 'transparent']}
          style={[styles.glowBall, { bottom: height * 0.2, right: -100 }]}
        />
      </View>

      <View style={styles.header}>
        <BrandLogo size="small" />
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('Analyses')} style={styles.iconButton}>
             <Map size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconButton}>
             <Settings size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.carouselWrapper}>
        <ThemesCarousel 
          globalScore={globalScore || 84} 
          isMeasuring={isMeasuring} 
          onNfcTap={handleNfcTap}
          onLongPress={handleLongPress}
        />
      </View>

      {/* App Store / Ecosystem Swipe Up Layer */}
      <Animated.View 
        style={[styles.bottomSheet, { transform: [{ translateY: panY }] }]}
        {...panResponder.panHandlers}
      >
        <BlurView intensity={60} tint="dark" style={styles.sheetContent}>
          <View style={styles.dragHandleWrapper}>
            <ChevronUp size={20} color={theme.colors.textSecondary} />
            <Typography variant="caption" style={styles.dragLabel}>ECOSSISTEMA</Typography>
          </View>

          <View style={styles.appDock}>
            <TouchableOpacity style={styles.appIconWrapper}>
              <View style={[styles.appIcon, { backgroundColor: theme.colors.biologicalBlue + '15', borderColor: theme.colors.biologicalBlue + '30' }]}>
                <Utensils size={20} color={theme.colors.biologicalBlue} />
              </View>
              <Typography variant="caption" style={styles.appLabel}>Nutri</Typography>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.appIconWrapper}>
              <View style={[styles.appIcon, { backgroundColor: theme.colors.wellnessGreen + '15', borderColor: theme.colors.wellnessGreen + '30' }]}>
                <Zap size={20} color={theme.colors.wellnessGreen} />
              </View>
              <Typography variant="caption" style={styles.appLabel}>Female</Typography>
            </TouchableOpacity>

            <TouchableOpacity style={styles.appIconWrapper}>
              <View style={[styles.appIcon, { backgroundColor: 'rgba(212, 175, 55, 0.15)', borderColor: 'rgba(212, 175, 55, 0.3)' }]}>
                <Activity size={20} color={theme.colors.warning} />
              </View>
              <Typography variant="caption" style={styles.appLabel}>MySup</Typography>
            </TouchableOpacity>
          </View>
          
          <View style={styles.storeGrid}>
            <Typography style={styles.storeTitle}>ablute_ apps</Typography>
            <Typography style={styles.storeSubtitle}>Expanda a sua inteligência biológica.</Typography>
            
            {/* Real App Store Items */}
            {[
              { id: '1', name: 'ablute_ sleep', desc: 'Sincronização profunda de ondas cerebrais.', icon: <Moon size={24} color={theme.colors.biologicalBlue} /> },
              { id: '2', name: 'ablute_ longevity', desc: 'Rastreio do relógio epigenético e envelhecimento.', icon: <Activity size={24} color={theme.colors.wellnessGreen} /> },
              { id: '3', name: 'ablute_ connect', desc: 'Transmissão encriptada para o seu médico.', icon: <Shield size={24} color={theme.colors.warning} /> },
              { id: '4', name: 'ablute_ mind', desc: 'Gestão de carga cognitiva e clareza mental.', icon: <Zap size={24} color={theme.colors.primary} /> },
            ].map((app) => (
              <View key={app.id} style={styles.appStoreCard}>
                <View style={styles.appStoreIconWrapper}>
                  {app.icon}
                </View>
                <View style={styles.appStoreInfo}>
                  <Typography style={styles.appStoreName}>{app.name}</Typography>
                  <Typography variant="caption" style={styles.appStoreDesc}>{app.desc}</Typography>
                </View>
                <TouchableOpacity style={styles.installBtn}>
                  <Typography variant="caption" style={styles.installBtnText}>OBTER</Typography>
                </TouchableOpacity>
              </View>
            ))}
            <View style={{ height: 100 }} />
          </View>
        </BlurView>
      </Animated.View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  atmosphere: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glowBall: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    zIndex: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: height * 0.15, // Offset for the bottom sheet to perfectly center the nucleus visually
  },
  statusContainer: {
    position: 'absolute',
    bottom: 40,
  },
  statusText: {
    letterSpacing: 3,
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    opacity: 0.5,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: height * 0.15, // Provide space for the drag handle
  },
  appDock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  appIconWrapper: {
    alignItems: 'center',
  },
  appIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
  },
  appLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  sheetContent: {
    flex: 1,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  dragHandleWrapper: {
    alignItems: 'center',
    paddingBottom: theme.spacing.md,
  },
  dragLabel: {
    fontSize: 9,
    letterSpacing: 4,
    marginTop: 4,
    opacity: 0.6,
  },
  storeGrid: {
    marginTop: theme.spacing.xl,
  },
  storeTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  storeSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.xs,
  },
  mockStoreItem: {
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  }
});
