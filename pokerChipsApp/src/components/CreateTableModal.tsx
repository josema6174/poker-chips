import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PLAYER_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const STACK_OPTIONS = [
  { value: 1000, label: '1,000' },
  { value: 5000, label: '5,000' },
  { value: 10000, label: '10,000' },
];

interface CreateTableModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateTable: (players: number, stack: number) => void;
}

/**
 * CreateTableModal - Modal for configuring a new poker table.
 * Allows selecting number of players (2-10) and starting stack per player.
 */
export default function CreateTableModal({
  visible,
  onClose,
  onCreateTable,
}: CreateTableModalProps) {
  const [selectedPlayers, setSelectedPlayers] = useState(6);
  const [selectedStack, setSelectedStack] = useState(5000);

  // Backdrop animation
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      backdropOpacity.setValue(0);
      slideAnim.setValue(300);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const handleCreate = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onCreateTable(selectedPlayers, selectedStack));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>

      {/* Modal Content */}
      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.modalContent}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>♠</Text>
            <Text style={styles.headerTitle}>Configurar Mesa</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Players Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Jugadores</Text>
            <Text style={styles.sectionHint}>¿Cuántos van a jugar?</Text>
            <View style={styles.playerGrid}>
              {PLAYER_OPTIONS.map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.playerChip,
                    selectedPlayers === num && styles.playerChipSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedPlayers(num)}
                >
                  <Text
                    style={[
                      styles.playerChipText,
                      selectedPlayers === num && styles.playerChipTextSelected,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stack Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Stack Inicial</Text>
            <Text style={styles.sectionHint}>Fichas por jugador</Text>
            <View style={styles.stackRow}>
              {STACK_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.stackCard,
                    selectedStack === option.value && styles.stackCardSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedStack(option.value)}
                >
                  <Text style={styles.stackChipIcon}>●</Text>
                  <Text
                    style={[
                      styles.stackValue,
                      selectedStack === option.value &&
                        styles.stackValueSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.stackUnit}>fichas</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total en mesa</Text>
              <Text style={styles.summaryValue}>
                {(selectedPlayers * selectedStack).toLocaleString()} fichas
              </Text>
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={styles.createButton}
            activeOpacity={0.8}
            onPress={handleCreate}
          >
            <Text style={styles.createButtonText}>Crear Mesa</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.7}
            onPress={handleClose}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  backdropTouch: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    backgroundColor: '#111a12',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  headerIcon: {
    color: '#22c55e',
    fontSize: 24,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionHint: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 13,
    marginBottom: 14,
  },
  playerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  playerChip: {
    width: (SCREEN_WIDTH - 48 - 8 * 4) / 5, // 5 per row with gaps
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  playerChipSelected: {
    backgroundColor: '#166534',
    borderColor: '#22c55e',
  },
  playerChipText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    fontWeight: '600',
  },
  playerChipTextSelected: {
    color: '#ffffff',
  },
  stackRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stackCard: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  stackCardSelected: {
    backgroundColor: 'rgba(22, 101, 52, 0.4)',
    borderColor: '#22c55e',
  },
  stackChipIcon: {
    color: '#22c55e',
    fontSize: 18,
    marginBottom: 6,
  },
  stackValue: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    fontWeight: '800',
  },
  stackValueSelected: {
    color: '#ffffff',
  },
  stackUnit: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 11,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summary: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
  },
  summaryValue: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '700',
  },
  createButton: {
    backgroundColor: '#166534',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
    // Shadow
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 15,
    fontWeight: '500',
  },
});
