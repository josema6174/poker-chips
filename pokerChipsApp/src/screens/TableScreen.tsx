import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ChipStack from '../components/ChipStack';
import TableSidebar from '../components/TableSidebar';
import DealerView from '../components/DealerView';
import { distributeChips, calculateTotalValue } from '../lib/chipDistribution';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TableScreenProps {
  players: number;
  stack: number;
  onLeaveTable: () => void;
}

/**
 * TableScreen - The main poker table screen showing the player's chip stacks.
 * Displays 5 denominations (500, 100, 50, 20, 5) distributed based on config.
 */
export default function TableScreen({ players, stack, onLeaveTable }: TableScreenProps) {
  // Local state for chips to allow decrementing when betting
  const [chips, setChips] = useState(() => distributeChips(stack));
  const [currentBet, setCurrentBet] = useState(0);
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'history' | 'dealer'>('table');

  // If stack prop changes (e.g., config changes), reset chips
  useEffect(() => {
    setChips(distributeChips(stack));
    setCurrentBet(0);
  }, [stack]);

  const totalValue = useMemo(() => calculateTotalValue(chips), [chips]);

  const handleChipSwipe = (value: number) => {
    setChips((prevChips) =>
      prevChips.map((chip) => {
        if (chip.value === value && chip.count > 0) {
          return { ...chip, count: chip.count - 1 };
        }
        return chip;
      })
    );
    setCurrentBet((prev) => prev + value);
  };

  const handleCancelBet = () => {
    // Re-distribute the total original stack to reset the specific counts
    // In a real app, you might want to specifically restore the exact chips bet
    // but re-distributing is easiest for now to ensure valid counts.
    // Or we can just calculate the new total and distribute that.
    // Better: keep track of original state or simply re-distribute (totalValue + currentBet)
    setChips(distributeChips(totalValue + currentBet));
    setCurrentBet(0);
  };

  const handleConfirmBet = () => {
    // TODO: Send bet to server
    console.log(`Apuesta confirmada: ${currentBet}`);
    setCurrentBet(0);
    // Chips are already deducted
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Sidebar Component */}
      <TableSidebar
        visible={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLeaveTable={onLeaveTable}
      />

      {/* Header */}
      <View style={styles.header}>
        {/* Absolute positioned menu button */}
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setIsSidebarOpen(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        {/* Centered Title Area */}
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>♠ Mesa</Text>
          <Text style={styles.headerSubtitle}>{players} jugadores</Text>
        </View>
      </View>

      {/* Horizontal Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'table' && styles.navItemActive]}
          onPress={() => setActiveTab('table')}
          activeOpacity={0.7}
        >
          <Text style={[styles.navText, activeTab === 'table' && styles.navTextActive]}>
            Mesa
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'dealer' && styles.navItemActive]}
          onPress={() => setActiveTab('dealer')}
          activeOpacity={0.7}
        >
          <Text style={[styles.navText, activeTab === 'dealer' && styles.navTextActive]}>
            Dealer Button
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {activeTab === 'table' ? (
        <>
          {/* Table area */}
          <View style={styles.tableArea}>
            {/* Felt texture hint */}
            <View style={styles.feltOverlay} />

            {/* Chip stacks */}
            <View style={styles.chipsContainer}>
          {chips.map((chip) => (
            <ChipStack
              key={chip.value}
              value={chip.value}
              count={chip.count}
              color={chip.color}
              accentColor={chip.accentColor}
              label={chip.label}
              onSwipeUp={() => handleChipSwipe(chip.value)}
            />
          ))}
        </View>

        {/* Stack summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Stack Total</Text>
              <Text style={styles.summaryValue}>
                {totalValue.toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fichas</Text>
              <Text style={styles.summaryChipCount}>
                {chips.reduce((sum, c) => sum + c.count, 0)} fichas
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
      ) : activeTab === 'history' ? (
        /* History area */
        <View style={styles.historyArea}>
          <Text style={styles.historyIcon}></Text>
          <Text style={styles.historyTitle}>Historial de Apuestas</Text>
          <Text style={styles.historySubtitle}>Próximamente...</Text>
          <Text style={styles.historyDesc}>
            Acá vas a poder ver el registro de las rondas de apuestas, quién subió, quién se retiró y cuánto hay en el pozo.
          </Text>
        </View>
      ) : (
        /* Dealer area */
        <DealerView players={players} />
      )}

      {/* Betting Bar / Bottom Bar - Only show on table tab */}
      {activeTab === 'table' && (
        <View style={styles.bottomBar}>
          {currentBet > 0 ? (
            <View style={styles.activeBetContainer}>
            <View style={styles.betAmountWrapper}>
              <Text style={styles.betLabel}>APUESTA</Text>
              <Text style={styles.betAmount}>{currentBet.toLocaleString()}</Text>
            </View>
            <View style={styles.betActions}>
              <TouchableOpacity
                style={styles.cancelBetButton}
                activeOpacity={0.7}
                onPress={handleCancelBet}
              >
                <Text style={styles.cancelBetText}>✕ Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBetButton}
                activeOpacity={0.8}
                onPress={handleConfirmBet}
              >
                <Text style={styles.confirmBetText}>✓ Apostar</Text>
              </TouchableOpacity>
            </View>
          </View>
          ) : (
            <Text style={styles.bottomBarText}>
              Deslizá una ficha hacia arriba para apostar
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1b0e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    left: 20,
    top: 12,
    padding: 4,
    zIndex: 10,
  },
  menuIcon: {
    color: '#ffffff',
    fontSize: 28,
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 13,
    marginTop: 2,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 16,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  navItemActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  navText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#22c55e',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginHorizontal: 20,
  },
  tableArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  feltOverlay: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '10%',
    borderRadius: 40,
    backgroundColor: 'rgba(22, 101, 52, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(22, 101, 52, 0.15)',
  },
  chipsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: SCREEN_WIDTH - 32,
    paddingHorizontal: 8,
  },
  summaryContainer: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 8,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
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
    fontSize: 18,
    fontWeight: '800',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginVertical: 12,
  },
  summaryChipCount: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomBar: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  bottomBarText: {
    color: 'rgba(255, 255, 255, 0.25)',
    fontSize: 14,
    fontStyle: 'italic',
  },
  activeBetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  betAmountWrapper: {
    flex: 1,
  },
  betLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  betAmount: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
  },
  betActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBetButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  cancelBetText: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmBetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#166534',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBetText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  historyArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  historyIcon: {
    fontSize: 48,
    marginBottom: 16,
    color: 'rgba(255, 255, 255, 0.2)',
  },
  historyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  historySubtitle: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  historyDesc: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
