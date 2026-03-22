import React, { useRef, useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, Animated, Platform, useWindowDimensions, PanResponder, TouchableOpacity, ScrollView, Easing, Modal } from 'react-native';
import { theme } from '../theme';
import { Typography } from './Base';
import { Nucleus } from './Nucleus';
import { X, ChevronLeft, ChevronRight, Plus, Minus, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
interface CardNode {
  id: string;
  isHome: boolean;
  label: string;       // theme_label
  score: number;       // theme_score
  short: string;       // theme_short
  longTitle: string;   // theme_long_title
  detail: string;      // theme_detail
  actions: string[];   // theme_action_1/2/3
  contribution: string; // theme_contribution_explainer
  accent: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COHERENT NARRATIVE — All 7 cards tell the same story from different angles
// ─────────────────────────────────────────────────────────────────────────────
// Today: solid foundation, good energy, body prefers consistency over excess.
// Recovery is active. No alarms. Best approach: steady rhythm, hydrate, rest well.
// ─────────────────────────────────────────────────────────────────────────────

const CARDS: CardNode[] = [
  { id: 'home', isHome: true, label: '', score: 0, short: '', longTitle: '', detail: '', actions: [], contribution: '', accent: '#00D4AA' },

  {
    id: 'performance',
    isHome: false,
    label: 'Performance & Equilíbrio',
    score: 81,
    short: 'Dia sólido',
    longTitle: 'Tens base para ter um bom desempenho hoje, mas o teu corpo parece responder melhor a equilíbrio do que a excesso.',
    detail: 'Continua capaz e funcional, mas já com sinais de carga acumulada. Se mantiveres controlo, ritmo e boa gestão do esforço, a resposta tende a ser melhor do que se tentares puxar ao máximo.',
    actions: ['Mantém um ritmo constante no treino', 'Hidrata-te bem ao longo do dia', 'Evita somar fadiga desnecessária ao fim do dia'],
    contribution: 'Para esta leitura, olharam-se sobretudo os sinais que ajudam a perceber como o teu corpo está a lidar com esforço e equilíbrio geral no dia de hoje. A tua frequência cardíaca de repouso apareceu um pouco acima do teu habitual e a variabilidade cardíaca ficou abaixo do teu baseline, o que muitas vezes é associado a maior carga fisiológica e menor frescura. Também foram considerados sinais urinários como creatinina e F2-isoprostanos, que ajudam a enquadrar concentração urinária e exigência do organismo após treino intenso.\n\nEsta leitura procura dar contexto funcional. Questões de saúde devem ser discutidas com o médico.',
    accent: '#00D4AA',
  },
  {
    id: 'energy',
    isHome: false,
    label: 'Energia & Disponibilidade',
    score: 85,
    short: 'Energia estável',
    longTitle: 'Tens energia disponível para o dia, mas não de forma infinita.',
    detail: 'O teu corpo continua a responder bem, embora possa perder estabilidade se descurares hidratação, refeições ou pausas. Hoje, pequenos ajustes ao longo do dia podem fazer diferença na forma como te manténs disponível.',
    actions: ['Não saltes refeições principais', 'Mantém água por perto o dia todo', 'Aproveita a manhã para tarefas que pedem mais foco'],
    contribution: 'Aqui pesaram mais os sinais ligados a hidratação, disponibilidade funcional e custo fisiológico do dia. O peso surgiu abaixo do teu habitual, e sódio, potássio e ureia urinários ajudaram a reforçar a ideia de um dia mais exigente, com sudorese e reposição ainda incompleta. Em conjunto, estes sinais são muitas vezes associados a energia disponível, mas menos estável se o corpo não for bem apoiado com água, alimentação e pausas.\n\nIsto não substitui avaliação clínica. Se houver dúvidas sobre saúde, o ideal é falar com um médico.',
    accent: '#00D4AA',
  },
  {
    id: 'besttoday',
    isHome: false,
    label: 'Dei o melhor de mim hoje?',
    score: 74,
    short: 'Boa base hoje',
    longTitle: 'Hoje, dar o teu melhor não significa forçar mais.',
    detail: 'Significa usar bem a capacidade que tens, com foco, critério e sem gastar o que o teu corpo ainda precisa para recuperar. O melhor de hoje parece estar mais na consistência do que em ir até ao limite.',
    actions: ['Adapta a intensidade ao que sentes', 'Se treinares, acaba antes de sentir fadiga a mais', 'Valoriza o que conseguires fazer — é suficiente'],
    contribution: 'Nesta leitura foram tidos em conta sobretudo os sinais que ajudam a perceber exigência, fadiga e capacidade de resposta no momento. A frequência cardíaca de repouso, a variabilidade cardíaca e a temperatura ligeiramente acima do teu habitual sugerem um corpo que já trabalhou bastante e que ainda está a reorganizar-se. A literatura associa muitas vezes este tipo de padrão a dias em que o melhor rendimento vem mais de boa gestão do que de insistir em mais carga.\n\nA interpretação clínica de questões de saúde cabe sempre a profissionais de saúde.',
    accent: '#00D4AA',
  },
  {
    id: 'endurance',
    isHome: false,
    label: 'Resistência saudável',
    score: 79,
    short: 'Ritmo constante',
    longTitle: 'O teu corpo mostra boa capacidade para aguentar bem o dia ou esforço moderado, desde que mantenhas um ritmo estável.',
    detail: 'Há base para continuidade, mas a melhor resposta tende a surgir com constância e não com picos de intensidade. Hoje, a tua resistência parece mais saudável quando é bem distribuída.',
    actions: ['Se treinares longo, mantém ritmo moderado', 'Repõe líquidos a cada 30 minutos', 'Não deixes a alimentação para depois do esforço'],
    contribution: 'Para este tema, o mais importante foi cruzar o teu baseline com os sinais do dia. O teu histórico mostra boa base cardiovascular e boa adaptação ao esforço, mas a leitura atual indica também algum custo acumulado. Foram especialmente relevantes a frequência cardíaca de repouso, a variabilidade cardíaca e alguns sinais urinários como ureia e creatinina, que ajudam a perceber como o corpo está a sustentar esforço e recuperação.\n\nEsta explicação serve apenas para contexto funcional e não para diagnóstico.',
    accent: '#00D4AA',
  },
  {
    id: 'recovery',
    isHome: false,
    label: 'Recuperação',
    score: 72,
    short: 'Em progresso',
    longTitle: 'O teu corpo está a recuperar, mas ainda não terminou esse processo.',
    detail: 'Não há sinais de quebra, mas há margem evidente para consolidar descanso, hidratação e reposição. Hoje, pode compensar mais proteger a recuperação do que acrescentar nova exigência.',
    actions: ['Privilegia sono de qualidade esta noite', 'Evita esforço intenso adicional hoje', 'Come bem e mantém-te hidratado'],
    contribution: 'Este é um dos temas em que os sinais do dia pesam mais. A variabilidade cardíaca abaixo do teu habitual, a frequência cardíaca de repouso acima do baseline, a temperatura ligeiramente superior e marcadores como creatinina, ureia e F2-isoprostanos ajudam a reforçar a ideia de recuperação ainda em curso. A literatura associa muitas vezes este conjunto de sinais a um organismo que continua funcional, mas ainda a consolidar descanso, hidratação e reposição.\n\nSe existirem dúvidas sobre saúde, sintomas ou alterações persistentes, deve falar com o médico.',
    accent: '#00D4AA',
  },
  {
    id: 'muscleage',
    isHome: false,
    label: 'Idade muscular',
    score: 82,
    short: 'Dentro do esperado',
    longTitle: 'A tua base muscular parece boa para o teu contexto, mas hoje o corpo tende a responder melhor a consistência do que a estímulos agressivos.',
    detail: 'Há boa margem funcional, mas a adaptação muscular beneficia mais de regularidade, alimentação e recuperação do que de insistir em carga alta num dia já exigente.',
    actions: ['Mantém treino regular com progressão leve', 'Garante boa ingestão de proteína ao longo do dia', 'Não descures o descanso entre sessões'],
    contribution: 'Aqui foram considerados sobretudo sinais que ajudam a enquadrar adaptação muscular, exigência do dia e capacidade de recuperação. Ureia e creatinina urinárias mais altas, juntamente com o peso ligeiramente abaixo do habitual e uma variabilidade cardíaca mais baixa, ajudam a perceber um corpo que treinou com intensidade e que pode beneficiar mais de regularidade e recuperação do que de insistência agressiva. Estes sinais são frequentemente usados na literatura para contextualizar esforço, adaptação e frescura funcional.\n\nEsta leitura não substitui aconselhamento médico e deve ser vista apenas como orientação funcional.',
    accent: '#00D4AA',
  },
  {
    id: 'overall',
    isHome: false,
    label: 'Avaliação geral',
    score: 80,
    short: 'Dia de manutenção',
    longTitle: 'No geral, o teu corpo está num bom lugar — hoje é um dia para consolidar.',
    detail: 'Olhando para o conjunto de sinais, a leitura geral é positiva. Não é um dia de pico, mas é um dia funcional, com boa base e sem alarmes. A melhor abordagem é de manutenção — manter bons hábitos, respeitar os limites e deixar o corpo consolidar o que tem. Dias assim são mais valiosos do que parecem.',
    actions: ['Mantém as rotinas que estão a funcionar', 'Dá atenção ao descanso e à alimentação', 'Amanhã podes rever e ajustar se necessário'],
    contribution: 'Esta avaliação combinou todos os sinais disponíveis: padrões do batimento cardíaco, temperatura, peso, avaliação intestinal e análise urinária. A leitura integrou estes dados para formar uma visão global do estado funcional do corpo. Nenhum dado isolado define a conclusão — o que conta é o conjunto dos sinais e a forma como se reforçam entre si. A leitura foi ajustada ao contexto esperado para a tua idade e sexo.',
    accent: '#00D4AA',
  },
];

const NODE_COUNT = CARDS.length; // 8 (home + 7 cards)

// ─────────────────────────────────────────────────────────────────────────────
// SCORE RING — clean circular score indicator
// ─────────────────────────────────────────────────────────────────────────────
const ScoreRing: React.FC<{ score: number; accent: string }> = ({ score, accent }) => {
  const radius = 32;
  const stroke = 3;
  const circ = 2 * Math.PI * radius;
  const progress = circ - (score / 100) * circ;

  if (Platform.OS === 'web') {
    return (
      <View style={ring.wrap}>
        <svg width={74} height={74} viewBox="0 0 74 74" style={{ position: 'absolute' } as any}>
          <circle cx="37" cy="37" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <circle cx="37" cy="37" r={radius} fill="none" stroke={accent} strokeWidth={stroke}
            strokeDasharray={`${circ}`} strokeDashoffset={`${progress}`}
            strokeLinecap="round" transform="rotate(-90 37 37)" />
        </svg>
        <Typography style={ring.num}>{score}</Typography>
      </View>
    );
  }
  return (
    <View style={ring.wrap}>
      <View style={[ring.track, { width: 74, height: 74, borderRadius: 37, borderWidth: stroke, borderColor: 'rgba(255,255,255,0.06)' }]}>
        <Typography style={ring.num}>{score}</Typography>
      </View>
    </View>
  );
};

const ring = StyleSheet.create({
  wrap: { width: 74, height: 74, alignItems: 'center', justifyContent: 'center' },
  track: { alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 24, fontWeight: '700', color: '#fff', letterSpacing: -1 },
});

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
const DynBg: React.FC<{ accent: string }> = ({ accent }) => {
  const dx = useRef(new Animated.Value(0)).current;
  const dy = useRef(new Animated.Value(0)).current;
  const p = useRef(new Animated.Value(0.2)).current;
  useEffect(() => {
    const a1 = Animated.loop(Animated.sequence([
      Animated.timing(dx, { toValue: 20, duration: 10000, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(dx, { toValue: -20, duration: 10000, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== 'web' }),
    ]));
    const a2 = Animated.loop(Animated.sequence([
      Animated.timing(dy, { toValue: 15, duration: 8000, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(dy, { toValue: -15, duration: 8000, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== 'web' }),
    ]));
    const a3 = Animated.loop(Animated.sequence([
      Animated.timing(p, { toValue: 0.4, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(p, { toValue: 0.15, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
    ]));
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [dx, dy, p]);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: '#080A0E' }} />
      <Animated.View style={{ position: 'absolute', width: 300, height: 300, borderRadius: 150, top: '5%', left: '5%', backgroundColor: accent + '10', opacity: p, transform: [{ translateX: dx }, { translateY: dy }], ...(Platform.OS === 'web' ? { filter: 'blur(90px)' } as any : {}) }} />
      <Animated.View style={{ position: 'absolute', width: 180, height: 180, borderRadius: 90, bottom: '20%', right: '5%', backgroundColor: accent + '08', opacity: p, transform: [{ translateX: Animated.multiply(dx, -0.5) }, { translateY: Animated.multiply(dy, -0.7) }], ...(Platform.OS === 'web' ? { filter: 'blur(60px)' } as any : {}) }} />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SHIMMER BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const ShimBtn: React.FC<{ style?: any; onPress: () => void; children: React.ReactNode }> = ({ style, onPress, children }) => {
  const sh = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.loop(Animated.timing(sh, { toValue: 1, duration: 3500, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' })).start(); }, [sh]);
  const tx = sh.interpolate({ inputRange: [0, 1], outputRange: [-50, 50] });
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.65} style={[bS.base, style]}>
      {children}
      <Animated.View style={[bS.shim, { transform: [{ translateX: tx }] }]} />
    </TouchableOpacity>
  );
};
const bS = StyleSheet.create({
  base: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center', ...(Platform.OS === 'web' ? { boxShadow: '0 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)' } as any : { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 6 }) },
  shim: { position: 'absolute', top: 0, width: 14, height: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, ...(Platform.OS === 'web' ? { filter: 'blur(8px)' } as any : {}) },
});

// ─────────────────────────────────────────────────────────────────────────────
// CARD COMPONENT — expandable with "+" 
// ─────────────────────────────────────────────────────────────────────────────
const ThemeCard: React.FC<{ card: CardNode }> = ({ card }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    Animated.spring(expandAnim, { toValue: next ? 1 : 0, tension: 50, friction: 12, useNativeDriver: false }).start();
  };

  const expandHeight = expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 380] });
  const expandOpacity = expandAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

  return (
    <View style={c.wrap}>
      {/* ── CLOSED STATE ── */}
      <View style={c.header}>
        <ScoreRing score={card.score} accent={card.accent} />
        <View style={c.headerText}>
          <Typography style={c.short}>{card.short}</Typography>
          <Typography style={c.label}>{card.label}</Typography>
        </View>
        <ShimBtn style={c.toggleBtn} onPress={toggle}>
          {isOpen ? <Minus size={18} color={card.accent} /> : <Plus size={18} color={card.accent} />}
        </ShimBtn>
      </View>

      {/* Long title — always visible */}
      <Typography style={c.longTitle}>{card.longTitle}</Typography>

      {/* ── EXPANDED STATE ── */}
      <Animated.View style={[c.expanded, { maxHeight: expandHeight, opacity: expandOpacity }]}>
        <View style={c.divider} />
        <Typography style={c.detail}>{card.detail}</Typography>

        <Typography style={c.actionsLabel}>O que pode ajudar hoje</Typography>
        {card.actions.map((a, i) => (
          <View key={i} style={c.actionRow}>
            <View style={[c.actionDot, { backgroundColor: card.accent + '40' }]} />
            <Typography style={c.actionText}>{a}</Typography>
          </View>
        ))}

        <TouchableOpacity style={[c.contribBtn, { borderColor: card.accent + '30' }]} onPress={() => setShowModal(true)} activeOpacity={0.7}>
          <Info size={14} color={card.accent} style={{ marginRight: 8 }} />
          <Typography style={[c.contribBtnText, { color: card.accent }]}>Referências</Typography>
        </TouchableOpacity>
      </Animated.View>

      {/* ── MODAL ── */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={m.overlay}>
          <View style={m.card}>
            <View style={m.handle} />
            <Typography style={m.title}>Referências</Typography>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 340 }}>
              <Typography style={m.text}>{card.contribution}</Typography>
            </ScrollView>
            <TouchableOpacity style={[m.closeBtn, { backgroundColor: card.accent + '15', borderColor: card.accent + '30' }]} onPress={() => setShowModal(false)}>
              <Typography style={[m.closeTxt, { color: card.accent }]}>Fechar</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const c = StyleSheet.create({
  wrap: { width: '100%', paddingHorizontal: 32 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  headerText: { flex: 1, marginLeft: 16 },
  short: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: -0.3, marginBottom: 2 },
  label: { fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5 },
  toggleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  longTitle: { fontSize: 16, fontWeight: '400', color: 'rgba(255,255,255,0.7)', lineHeight: 24, marginBottom: 8 },
  expanded: { overflow: 'hidden' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 16 },
  detail: { fontSize: 15, lineHeight: 24, color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginBottom: 20 },
  actionsLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.4)', marginBottom: 12, letterSpacing: 0.3 },
  actionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  actionDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7, marginRight: 10 },
  actionText: { flex: 1, fontSize: 15, lineHeight: 22, color: 'rgba(255,255,255,0.6)', fontWeight: '400' },
  contribBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, paddingVertical: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1 },
  contribBtnText: { fontSize: 14, fontWeight: '600' },
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 440, backgroundColor: '#12151B', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 },
  text: { fontSize: 14, lineHeight: 23, color: 'rgba(255,255,255,0.55)', fontWeight: '400' },
  closeBtn: { marginTop: 20, paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1 },
  closeTxt: { fontSize: 14, fontWeight: '600' },
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CAROUSEL
// ─────────────────────────────────────────────────────────────────────────────
export interface ThemesCarouselProps {
  globalScore: number;
  isMeasuring: boolean;
  onNfcTap: () => void;
  onLongPress: () => void;
  onNodeChange?: (isHome: boolean) => void;
  daysSinceExam?: number;
}

export const ThemesCarousel: React.FC<ThemesCarouselProps> = ({ globalScore, isMeasuring, onNfcTap, onLongPress, onNodeChange, daysSinceExam = 14 }) => {
  const { width } = useWindowDimensions();
  const CW = Platform.OS === 'web' ? Math.min(width, 600) : width;

  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { onNodeChange?.(CARDS[activeIndex].isHome); }, [activeIndex, onNodeChange]);

  const navigateTo = useCallback((dir: 'next' | 'prev') => {
    const ex = dir === 'next' ? -1 : 1;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 130, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(slideAnim, { toValue: ex * -40, duration: 130, useNativeDriver: Platform.OS !== 'web' }),
    ]).start(() => {
      setActiveIndex((p: number) => dir === 'next' ? (p + 1) % NODE_COUNT : (p - 1 + NODE_COUNT) % NODE_COUNT);
      slideAnim.setValue(ex * 40);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: Platform.OS !== 'web' }),
        Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 10, useNativeDriver: Platform.OS !== 'web' }),
      ]).start();
    });
  }, [fadeAnim, slideAnim]);

  const goHome = useCallback(() => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: Platform.OS !== 'web' }).start(() => {
      setActiveIndex(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: Platform.OS !== 'web' }).start();
    });
  }, [fadeAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 12 && Math.abs(gs.dy) < 50,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -30 || gs.vx < -0.3) navigateTo('next');
        else if (gs.dx > 30 || gs.vx > 0.3) navigateTo('prev');
      },
    })
  ).current;

  const n = CARDS[activeIndex];

  return (
    <View style={[s.root, { width: CW }]} {...panResponder.panHandlers}>
      {!n.isHome && <DynBg accent={n.accent} />}

      {Platform.OS === 'web' && (
        <>
          <ShimBtn style={[s.arw, s.arwL]} onPress={() => navigateTo('prev')}>
            <ChevronLeft size={18} color="rgba(255,255,255,0.3)" />
          </ShimBtn>
          <ShimBtn style={[s.arw, s.arwR]} onPress={() => navigateTo('next')}>
            <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
          </ShimBtn>
        </>
      )}

      {!n.isHome && (
        <ShimBtn style={s.xBtn} onPress={goHome}>
          <X size={16} color="rgba(255,255,255,0.4)" />
        </ShimBtn>
      )}

      <Animated.View style={[s.stage, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
        {n.isHome ? (
          <View style={s.home}>
            <Nucleus score={globalScore} status={isMeasuring ? 'forte' : 'fraco'} onPress={onNfcTap} onLongPress={onLongPress} daysSinceExam={daysSinceExam} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }} style={{ flex: 1, width: '100%' }}>
            <ThemeCard card={n} />
          </ScrollView>
        )}
      </Animated.View>

      <View style={s.dots}>
        {CARDS.map((t, i) => (
          <View key={t.id} style={[s.dot, i === activeIndex && s.dotA, i === activeIndex && { backgroundColor: t.isHome ? '#00D4AA' : t.accent }]} />
        ))}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stage: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  home: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, gap: 6 },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(255,255,255,0.1)' },
  dotA: { width: 8, height: 8, borderRadius: 4 },
  arw: { position: 'absolute', top: '45%', zIndex: 40, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  arwL: { left: 2 },
  arwR: { right: 2 },
  xBtn: { position: 'absolute', top: 4, right: 14, zIndex: 50, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
});
