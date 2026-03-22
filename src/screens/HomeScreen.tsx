import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, PanResponder, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { Container, Typography } from '../components/Base';
import { theme } from '../theme';
import { useStore } from '../store/useStore';
import { BrandLogo } from '../components/BrandLogo';
import { ThemesCarousel } from '../components/ThemesCarousel';
import { Utensils, Zap, Map, SlidersHorizontal, Activity, ChevronUp, ChevronDown, Moon, Shield, Database, Smartphone, X, User, LogOut, Bell, Lock, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// ── Raw Biomarker Data (no interpretation) ──────────────────────────────────
const RAW_BIOMARKERS = [
  { id: 'b1',  name: 'NT-proBNP',      value: '120',      unit: 'pg/mL',  source: 'ablute' },
  { id: 'b2',  name: 'F2-isoprostanos', value: '2.4',      unit: 'ng/mg',  source: 'ablute' },
  { id: 'b3',  name: 'Sódio',          value: '140',      unit: 'mEq/L',  source: 'ablute' },
  { id: 'b4',  name: 'Potássio',       value: '4.2',      unit: 'mEq/L',  source: 'ablute' },
  { id: 'b5',  name: 'Creatinina',     value: '0.9',      unit: 'mg/dL',  source: 'ablute' },
  { id: 'b6',  name: 'Albumina',       value: '4.5',      unit: 'g/dL',   source: 'ablute' },
  { id: 'b7',  name: 'NGAL',           value: '15',       unit: 'ng/mL',  source: 'ablute' },
  { id: 'b8',  name: 'KIM-1',          value: '0.8',      unit: 'ng/mL',  source: 'ablute' },
  { id: 'b9',  name: 'Cistatina C',    value: '0.85',     unit: 'mg/L',   source: 'ablute' },
  { id: 'b10', name: 'Glicose',        value: '90',       unit: 'mg/dL',  source: 'ablute' },
  { id: 'b11', name: 'pH',             value: '6.4',      unit: 'pH',     source: 'ablute' },
  { id: 'b12', name: 'Nitritos',       value: 'Negativo', unit: '',       source: 'ablute' },
  { id: 'b13', name: 'Ureia',          value: '30',       unit: 'mg/dL',  source: 'ablute' },
  { id: 'b14', name: 'Ácido úrico',    value: '5.2',      unit: 'mg/dL',  source: 'ablute' },
  { id: 'b15', name: 'Ritmo Cardíaco', value: '62',       unit: 'bpm',    source: 'health_kit' },
  { id: 'b16', name: 'Temperatura',    value: '36.6',     unit: '°C',     source: 'health_kit' },
];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { height } = useWindowDimensions();
  // Metro cache bust
  const { globalScore, setGlobalScore, setIsMeasuring, isMeasuring } = useStore();

  // App Store Bottom Sheet Animation State
  const panY = useRef(new Animated.Value(height * 0.85)).current; // Start mostly hidden
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isOnHome, setIsOnHome] = useState(true);
  const [daysSinceExam, setDaysSinceExam] = useState(14); // days since last analysis
  const [showProfile, setShowProfile] = useState(false);
  const [showControl, setShowControl] = useState(false);

  // Fake user data (replace with real store later)
  const userProfile = {
    name: 'Nuno Morais',
    email: 'nuno@ablute.com',
    plan: 'ablute_ Pro',
    joined: 'Jan 2025',
    exams: 12,
  };

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

  // ── TOP PULL-DOWN: Biomarkers Raw Data Panel ──────────────────────────────
  const topPanY = useRef(new Animated.Value(-height)).current; // Start fully above screen
  const [isBioOpen, setIsBioOpen] = useState(false);

  const topPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_e: any, gestureState: any) => {
        if (gestureState.dy > 60 || gestureState.vy > 0.5) {
          // Pull down: open
          setIsBioOpen(true);
          Animated.spring(topPanY, { toValue: 0, tension: 50, friction: 10, useNativeDriver: true }).start();
        } else if (gestureState.dy < -60 || gestureState.vy < -0.5) {
          // Push up: close
          setIsBioOpen(false);
          Animated.timing(topPanY, { toValue: -height, duration: 300, useNativeDriver: true }).start();
        } else {
          // Snap back
          if (isBioOpen) {
            Animated.spring(topPanY, { toValue: 0, tension: 50, friction: 10, useNativeDriver: true }).start();
          } else {
            Animated.timing(topPanY, { toValue: -height, duration: 300, useNativeDriver: true }).start();
          }
        }
      },
    })
  ).current;

  const openBioPanel = () => {
    setIsBioOpen(true);
    Animated.spring(topPanY, { toValue: 0, tension: 50, friction: 10, useNativeDriver: true }).start();
  };

  const closeBioPanel = () => {
    setIsBioOpen(false);
    Animated.timing(topPanY, { toValue: -height, duration: 300, useNativeDriver: true }).start();
  };
  
  const handleNfcTap = () => {
    console.log('NFC Analysis triggered');
    setDaysSinceExam(0); // Reset counter — nucleus shrinks to minimum
    navigation.navigate('Pairing');
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
        <BrandLogo size="medium" />
        {/* Right column: avatar/name on top, icons below */}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.profileBadge} onPress={() => setShowProfile(true)} activeOpacity={0.8}>
            <View style={styles.avatar}>
              <User size={15} color="#ffffff" />
            </View>
            <Typography style={styles.profileName}>Nuno</Typography>
          </TouchableOpacity>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Analyses')} style={styles.iconButton}>
               <Map size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowControl(true)} style={styles.iconButton}>
               <SlidersHorizontal size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── FLOATING PROFILE MODAL ─────────────────────────────────────── */}
      {showProfile && (
        <View style={styles.profileModalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={() => setShowProfile(false)} activeOpacity={1} />
          <BlurView intensity={Platform.OS === 'web' ? 20 : 60} tint="dark" style={styles.profileModal}>
            <View style={styles.profileModalInner}>
              {/* Close button */}
              <TouchableOpacity style={styles.profileClose} onPress={() => setShowProfile(false)}>
                <X size={18} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>

              {/* Avatar + identity */}
              <View style={styles.profileHeader}>
                <View style={styles.profileAvatarLg}>
                  <User size={36} color="#ffffff" />
                </View>
                <Typography style={styles.profileModalName}>{userProfile.name}</Typography>
                <Typography style={styles.profileModalEmail}>{userProfile.email}</Typography>
                <View style={styles.profilePlanBadge}>
                  <Typography style={styles.profilePlanText}>{userProfile.plan}</Typography>
                </View>
              </View>

              {/* Stats row */}
              <View style={styles.profileStats}>
                <View style={styles.profileStat}>
                  <Typography style={styles.profileStatNum}>{userProfile.exams}</Typography>
                  <Typography style={styles.profileStatLabel}>Avaliações</Typography>
                </View>
                <View style={styles.profileStatDivider} />
                <View style={styles.profileStat}>
                  <Typography style={styles.profileStatNum}>{daysSinceExam}</Typography>
                  <Typography style={styles.profileStatLabel}>Dias{'\n'}sem avaliação</Typography>
                </View>
                <View style={styles.profileStatDivider} />
                <View style={styles.profileStat}>
                  <Typography style={styles.profileStatNum}>{userProfile.joined}</Typography>
                  <Typography style={styles.profileStatLabel}>Membro{'\n'}desde</Typography>
                </View>
              </View>

              {/* Menu items */}
              <View style={styles.profileMenu}>
                {[
                  { icon: <Bell size={17} color={theme.colors.biologicalBlue} />, label: 'Notificações' },
                  { icon: <Lock size={17} color={theme.colors.biologicalBlue} />, label: 'Privacidade & Dados' },
                  { icon: <SlidersHorizontal size={17} color={theme.colors.biologicalBlue} />, label: 'Preferências' },
                ].map((item, i) => (
                  <TouchableOpacity key={i} style={styles.profileMenuItem} activeOpacity={0.75}>
                    <View style={styles.profileMenuIcon}>{item.icon}</View>
                    <Typography style={styles.profileMenuLabel}>{item.label}</Typography>
                    <ChevronRight size={14} color="rgba(255,255,255,0.25)" />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sign out */}
              <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.75}>
                <LogOut size={15} color="rgba(255,100,100,0.8)" />
                <Typography style={styles.signOutText}>Terminar sessão</Typography>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      )}

      {/* ── FLOATING CONTROL MODAL ─────────────────────────────────────── */}
      {showControl && (
        <View style={styles.profileModalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={() => setShowControl(false)} activeOpacity={1} />
          <BlurView intensity={Platform.OS === 'web' ? 20 : 60} tint="dark" style={styles.profileModal}>
            <View style={styles.profileModalInner}>
              {/* Close */}
              <TouchableOpacity style={styles.profileClose} onPress={() => setShowControl(false)}>
                <X size={18} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>

              {/* Header */}
              <View style={styles.profileHeader}>
                <View style={styles.profileAvatarLg}>
                  <SlidersHorizontal size={36} color="#ffffff" />
                </View>
                <Typography style={styles.profileModalName}>Controlo</Typography>
                <Typography style={styles.profileModalEmail}>Configurações da app e dispositivos</Typography>
                <View style={styles.profilePlanBadge}>
                  <Typography style={styles.profilePlanText}>ablute_ Pro</Typography>
                </View>
              </View>

              {/* Menu items */}
              <View style={styles.profileMenu}>
                {[
                  { icon: <Smartphone size={17} color={theme.colors.biologicalBlue} />, label: 'Dispositivos ligados' },
                  { icon: <Activity size={17} color={theme.colors.biologicalBlue} />, label: 'Modo de análise' },
                  { icon: <SlidersHorizontal size={17} color={theme.colors.biologicalBlue} />, label: 'Parâmetros & Thresholds' },
                  { icon: <Moon size={17} color={theme.colors.biologicalBlue} />, label: 'Modo escuro' },
                  { icon: <Database size={17} color={theme.colors.biologicalBlue} />, label: 'Exportar dados' },
                ].map((item, i) => (
                  <TouchableOpacity key={i} style={styles.profileMenuItem} activeOpacity={0.75}>
                    <View style={styles.profileMenuIcon}>{item.icon}</View>
                    <Typography style={styles.profileMenuLabel}>{item.label}</Typography>
                    <ChevronRight size={14} color="rgba(255,255,255,0.25)" />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Version info */}
              <View style={[styles.signOutBtn, { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }]}>
                <Typography style={[styles.signOutText, { color: 'rgba(255,255,255,0.3)', fontSize: 12 }]}>ablute_ wellness · v1.0.0</Typography>
              </View>
            </View>
          </BlurView>
        </View>
      )}

      {/* Pull-down hint handle on header */}
      <TouchableOpacity style={styles.pullDownHint} onPress={openBioPanel}>
        <ChevronDown size={16} color={theme.colors.textMuted} />
      </TouchableOpacity>

      <View style={[styles.carouselWrapper, isOnHome ? { paddingBottom: height * 0.15 } : { paddingBottom: 0 }]}>
        {/* Frosted glass overlay — only on Home */}
        {isOnHome && (
          <View style={styles.frostOverlay} pointerEvents="none">
            <BlurView intensity={Platform.OS === 'web' ? 8 : 15} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8, 12, 20, 0.35)' }]} />
          </View>
        )}
        {/* Days label — IN FRONT of frosted glass */}
        {isOnHome && daysSinceExam > 0 && (
          <View style={styles.daysLabelFront} pointerEvents="none">
            <Typography style={styles.daysLabelText}>
              {daysSinceExam === 1 ? '1 dia desde a última avaliação' : `${daysSinceExam} dias desde a última avaliação`}
            </Typography>
          </View>
        )}
        <ThemesCarousel 
          globalScore={globalScore || 84} 
          isMeasuring={isMeasuring} 
          onNfcTap={handleNfcTap}
          onLongPress={handleLongPress}
          onNodeChange={(home: boolean) => setIsOnHome(home)}
          daysSinceExam={daysSinceExam}
        />
      </View>

      {/* App Store / Ecosystem Swipe Up Layer — hidden on theme nodes */}
      {isOnHome && (
      <Animated.View 
        style={[styles.bottomSheet, { transform: [{ translateY: panY }] }]}
        {...panResponder.panHandlers}
      >
        <BlurView intensity={60} tint="dark" style={styles.sheetContent}>
          <View style={styles.dragHandleWrapper}>
            <ChevronUp size={20} color={theme.colors.textSecondary} />
            <Typography variant="caption" style={styles.dragLabel}>APP PLACE</Typography>
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
      )}

      {/* ── TOP PULL-DOWN: Biomarkers Raw Data Sheet ──────────────────── */}
      <Animated.View 
        style={[styles.topSheet, { transform: [{ translateY: topPanY }] }]}
        {...topPanResponder.panHandlers}
      >
        <BlurView intensity={80} tint="dark" style={styles.topSheetContent}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
            <View style={styles.topSheetHeader}>
              <Typography variant="h3" style={{ color: theme.colors.text, fontSize: 22, fontWeight: '300' }}>
                Exames
              </Typography>
              <Typography variant="caption" style={{ color: theme.colors.textMuted, marginTop: 4 }}>
                Dados em bruto · Sem interpretação
              </Typography>
            </View>

            {RAW_BIOMARKERS.map((item, index) => (
              <View key={item.id} style={[styles.bioRow, index !== RAW_BIOMARKERS.length - 1 && styles.bioRowBorder]}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {item.source === 'ablute' ? (
                      <Database size={11} color={theme.colors.biologicalBlue} style={{ marginRight: 6 }} />
                    ) : (
                      <Smartphone size={11} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
                    )}
                    <Typography style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text }}>{item.name}</Typography>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Typography style={{ fontSize: 20, fontWeight: '200', color: theme.colors.text }}>{item.value}</Typography>
                  <Typography variant="caption" style={{ color: theme.colors.textSecondary, fontSize: 11 }}>{item.unit}</Typography>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Bottom drag handle to close */}
          <TouchableOpacity style={styles.topSheetCloseHandle} onPress={closeBioPanel}>
            <ChevronUp size={20} color={theme.colors.textSecondary} />
            <Typography variant="caption" style={{ fontSize: 9, letterSpacing: 3, opacity: 0.6, marginTop: 2 }}>FECHAR</Typography>
          </TouchableOpacity>
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
    alignItems: 'flex-end',
    gap: 4,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 168, 230, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 230, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.2,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  // ── Profile Modal ──────────────────────────────────────────────────────────
  profileModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    justifyContent: 'flex-start',
  },
  profileModal: {
    marginHorizontal: 12,
    marginTop: 68,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  profileModalInner: {
    padding: 24,
    backgroundColor: 'rgba(5, 10, 24, 0.6)',
  },
  profileClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
  },
  profileAvatarLg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 168, 230, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(0, 168, 230, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  profileModalName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  profileModalEmail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 10,
  },
  profilePlanBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 168, 230, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 230, 0.3)',
  },
  profilePlanText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(0, 212, 170, 1)',
    letterSpacing: 0.5,
  },
  profileStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  profileStat: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatNum: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  profileStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 3,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  profileStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginVertical: 4,
  },
  profileMenu: {
    gap: 4,
    marginBottom: 20,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  profileMenuIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 168, 230, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileMenuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.1,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 70, 70, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 70, 70, 0.15)',
  },
  signOutText: {
    fontSize: 14,
    color: 'rgba(255,100,100,0.8)',
    fontWeight: '500',
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  frostOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    borderRadius: 0,
    overflow: 'hidden',
  },
  daysLabelFront: {
    position: 'absolute',
    top: '22%',
    left: 0,
    right: 0,
    zIndex: 2,
    alignItems: 'center',
  },
  daysLabelText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.5,
    textAlign: 'center',
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
    borderRadius: 16,
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
  },
  appStoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: theme.spacing.md,
    borderRadius: 16,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  appStoreIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appStoreInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  appStoreName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  appStoreDesc: {
    color: theme.colors.textMuted,
    lineHeight: 14,
  },
  installBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  installBtnText: {
    fontWeight: 'bold',
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  pullDownHint: {
    alignItems: 'center',
    paddingVertical: 4,
    zIndex: 10,
  },
  topSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  topSheetContent: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  topSheetHeader: {
    marginBottom: 28,
  },
  bioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  bioRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  topSheetCloseHandle: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
});
