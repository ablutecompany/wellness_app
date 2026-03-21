import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Container, Typography } from '../components/Base';
import { theme } from '../theme';
import { 
  Database, 
  Activity, 
  Heart,
  Smartphone,
  Info,
  X
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface Exam {
  id: string;
  name: string;
  value: string;
  unit: string;
  source: 'ablute' | 'health_kit';
  timestamp: string;
}

const TOP_EXAMS: Exam[] = [
  { id: 't1', name: 'Ritmo Cardíaco', value: '62', unit: 'bpm', source: 'health_kit', timestamp: 'Agora' },
  { id: 't2', name: 'PPG', value: 'Estável', unit: '', source: 'health_kit', timestamp: 'Agora' },
  { id: 't3', name: 'Análise Fecal', value: 'Sincronizado', unit: '', source: 'ablute', timestamp: 'Ontem, 08:30' },
  { id: 't4', name: 'Temperatura', value: '36.6', unit: '°C', source: 'health_kit', timestamp: 'Agora' },
];

const URINARY_MARKERS: Exam[] = [
  { id: '1', name: 'NT-proBNP', value: '120', unit: 'pg/mL', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '2', name: 'F2-isoprostanos', value: '2.4', unit: 'ng/mg', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '3', name: 'Sódio', value: '140', unit: 'mEq/L', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '4', name: 'Potássio', value: '4.2', unit: 'mEq/L', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '5', name: 'Creatinina', value: '0.9', unit: 'mg/dL', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '6', name: 'Albumina', value: '4.5', unit: 'g/dL', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '7', name: 'NGAL', value: '15', unit: 'ng/mL', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '8', name: 'KIM-1', value: '0.8', unit: 'ng/mL', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '9', name: 'Cistatina C', value: '0.85', unit: 'mg/L', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '10', name: 'Glicose', value: '90', unit: 'mg/dL', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '11', name: 'pH', value: '6.4', unit: 'pH', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '12', name: 'Nitritos', value: 'Negativo', unit: '', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '13', name: 'Ureia', value: '30', unit: 'mg/dL', source: 'ablute', timestamp: 'Hoje, 09:42' },
  { id: '14', name: 'Ácido úrico', value: '5.2', unit: 'mg/dL', source: 'ablute', timestamp: 'Hoje, 09:42' },
];

export const AnalysesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const renderSection = (title: string, data: Exam[]) => (
    <View style={styles.section}>
      <Typography variant="caption" style={styles.sectionTitle}>{title}</Typography>
      
      {data.map((item, index) => (
        <TouchableOpacity 
          key={item.id} 
          style={[styles.row, index !== data.length - 1 && styles.rowBorder]}
          onPress={() => setSelectedExam(item)}
        >
          <View style={styles.rowLeft}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.source === 'ablute' ? (
                <Database size={12} color={theme.colors.biologicalBlue} style={{ marginRight: 6 }} />
              ) : (
                <Smartphone size={12} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
              )}
              <Typography style={styles.name}>{item.name}</Typography>
            </View>
            <Typography variant="caption" style={styles.timestamp}>{item.timestamp}</Typography>
          </View>
          
          <View style={styles.rowRight}>
            <Typography style={styles.value}>{item.value}</Typography>
            <Typography variant="caption" style={styles.unit}>{item.unit}</Typography>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Container safe style={styles.container}>
      {/* Immersive Background Atmosphere */}
      <View style={styles.atmosphere}>
        <LinearGradient 
          colors={['rgba(0, 85, 255, 0.1)', 'transparent']}
          style={[styles.glowBall, { top: -150, right: -150 }]} 
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
            <Typography style={styles.backText}>{'< Voltar'}</Typography>
          </TouchableOpacity>
          <Typography variant="h2" style={styles.title}>Exames</Typography>
          <Typography style={styles.subtitle}>
            Leitura em tempo real da sua infraestrutura biológica.
          </Typography>
        </View>

        {renderSection('METABOLISMO & DADOS CORE', TOP_EXAMS)}
        {renderSection('MARCADORES URINÁRIOS', URINARY_MARKERS)}
        
      </ScrollView>

      {/* Explanation Modal */}
      <Modal
        visible={!!selectedExam}
        transparent={true}
        animationType="fade"
      >
        <BlurView intensity={80} tint="dark" style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackgroundDismiss} onPress={() => setSelectedExam(null)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" style={styles.modalTitle}>{selectedExam?.name}</Typography>
              <TouchableOpacity onPress={() => setSelectedExam(null)} style={styles.modalClose}>
                <X size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
               <Typography style={styles.modalText}>
                  Este biomarcador é geralmente associado na literatura médica a várias condições funcionais e metabólicas. 
                  Valores fora do intervalo comum podem indicar a necessidade de uma análise clínica mais profunda.
               </Typography>
               <Typography variant="caption" style={styles.modalDisclaimer}>
                  <Info size={12} color={theme.colors.warning} style={{ marginRight: 4 }} />
                  ALERTA: As informações aqui contidas servem estritamente um propósito de bem-estar e otimização biológica. 
                  Não correspondem a um dispositivo médico certificado, nem substituem qualquer diagnóstico ou teste laboratorial em ambiente clínico.
               </Typography>
            </View>
          </View>
        </BlurView>
      </Modal>
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
    width: 500,
    height: 500,
    borderRadius: 250,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    marginTop: theme.spacing.xl,
    marginBottom: 48,
  },
  backButton: {
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  backText: {
    color: theme.colors.biologicalBlue,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -1,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    opacity: 0.8,
    marginTop: 8,
    lineHeight: 20,
  },
  section: {
    marginBottom: 48,
  },
  sectionTitle: {
    letterSpacing: 4,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    fontSize: 10,
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  rowLeft: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  timestamp: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 4,
    marginLeft: 18,
  },
  value: {
    fontSize: 24,
    fontWeight: '300',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  unit: {
    marginLeft: 6,
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackgroundDismiss: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: theme.spacing.xl,
    paddingBottom: 60,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 24,
    color: theme.colors.biologicalBlue,
  },
  modalClose: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
  },
  modalBody: {
    marginTop: theme.spacing.sm,
  },
  modalText: {
    fontSize: 15,
    lineHeight: 24,
    color: theme.colors.text,
    opacity: 0.9,
    marginBottom: theme.spacing.xl,
  },
  modalDisclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    padding: theme.spacing.md,
    borderRadius: 12,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.warning,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  }
});
