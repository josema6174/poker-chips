import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Table dimensions
const TABLE_WIDTH = SCREEN_WIDTH * 0.85;
const TABLE_HEIGHT = SCREEN_HEIGHT * 0.55;
const CENTER_X = TABLE_WIDTH / 2;
const CENTER_Y = TABLE_HEIGHT / 2;

// Radii for players
const RADIUS_X = TABLE_WIDTH / 2;
const RADIUS_Y = TABLE_HEIGHT / 2;

// Radii for buttons (sitting inside the table)
const BUTTON_RADIUS_X = RADIUS_X * 0.65;
const BUTTON_RADIUS_Y = RADIUS_Y * 0.65;

interface DealerViewProps {
  players: number;
}

export default function DealerView({ players }: DealerViewProps) {
  const [dealerPosition, setDealerPosition] = useState(0);
  const isHeadsUp = players === 2;

  const handleNextHand = () => {
    setDealerPosition((prev) => (prev + 1) % players);
  };

  // 1. Calculate static player spots
  const playerSpots = useMemo(() => {
    return Array.from({ length: players }).map((_, index) => {
      const angle = (Math.PI / 2) + (index * ((2 * Math.PI) / players));
      return {
        id: index,
        label: `Jugador ${index + 1}`,
        playerX: CENTER_X + RADIUS_X * Math.cos(angle),
        playerY: CENTER_Y + RADIUS_Y * Math.sin(angle),
        buttonX: CENTER_X + BUTTON_RADIUS_X * Math.cos(angle),
        buttonY: CENTER_Y + BUTTON_RADIUS_Y * Math.sin(angle),
      };
    });
  }, [players]);

  // 2. Helper to get target coordinates for chips based on dealer position
  const getTargetPositions = (dealerIdx: number) => {
    const sbIdx = isHeadsUp ? dealerIdx : (dealerIdx + 1) % players;
    const bbIdx = isHeadsUp ? (dealerIdx + 1) % players : (dealerIdx + 2) % players;

    const dSpot = playerSpots[dealerIdx];
    const sbSpot = playerSpots[sbIdx];
    const bbSpot = playerSpots[bbIdx];

    // Offset the SB slightly if it's heads-up so it doesn't overlap perfectly with D
    const sbOffset = isHeadsUp ? 16 : 0;

    return {
      d: { x: dSpot.buttonX - 12, y: dSpot.buttonY - 12 }, // -12 to center the 24px chip
      sb: { x: sbSpot.buttonX - 12 + sbOffset, y: sbSpot.buttonY - 12 + sbOffset },
      bb: { x: bbSpot.buttonX - 12, y: bbSpot.buttonY - 12 },
    };
  };

  // 3. Setup Animated Values
  // We initialize them with the first position to avoid jumping from 0,0 on mount
  const initialPos = useMemo(() => getTargetPositions(0), [playerSpots]);
  
  const dAnim = useRef(new Animated.ValueXY(initialPos.d)).current;
  const sbAnim = useRef(new Animated.ValueXY(initialPos.sb)).current;
  const bbAnim = useRef(new Animated.ValueXY(initialPos.bb)).current;

  // 4. Animate whenever dealerPosition changes
  useEffect(() => {
    const targets = getTargetPositions(dealerPosition);

    Animated.parallel([
      Animated.spring(dAnim, {
        toValue: targets.d,
        useNativeDriver: true,
        friction: 6,
        tension: 40,
      }),
      Animated.spring(sbAnim, {
        toValue: targets.sb,
        useNativeDriver: true,
        friction: 6,
        tension: 40,
      }),
      Animated.spring(bbAnim, {
        toValue: targets.bb,
        useNativeDriver: true,
        friction: 6,
        tension: 40,
      }),
    ]).start();
  }, [dealerPosition, players, playerSpots]);

  return (
    <View style={styles.container}>
      <View style={styles.tableArea}>
        <View style={styles.table}>
          {/* Inner table line */}
          <View style={styles.innerTableLine} />

          {/* Render Players */}
          {playerSpots.map((spot) => (
            <View
              key={`player-${spot.id}`}
              style={[
                styles.playerSpot,
                {
                  left: spot.playerX - 30, // center 60px container
                  top: spot.playerY - 30,
                },
              ]}
            >
              <View style={styles.playerAvatar}>
                <Text style={styles.playerAvatarText}>{spot.id + 1}</Text>
              </View>
              <Text style={styles.playerLabel}>{spot.label}</Text>
            </View>
          ))}

          {/* Render Animated Chips */}
          <Animated.View
            style={[
              styles.indicatorChip,
              styles.dealerChip,
              { transform: dAnim.getTranslateTransform(), position: 'absolute', top: 0, left: 0 }
            ]}
          >
            <Text style={styles.dealerChipText}>D</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.indicatorChip,
              styles.sbChip,
              { transform: sbAnim.getTranslateTransform(), position: 'absolute', top: 0, left: 0 }
            ]}
          >
            <Text style={styles.blindChipText}>SB</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.indicatorChip,
              styles.bbChip,
              { transform: bbAnim.getTranslateTransform(), position: 'absolute', top: 0, left: 0 }
            ]}
          >
            <Text style={styles.blindChipText}>BB</Text>
          </Animated.View>

        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.rotateButton} onPress={handleNextHand}>
          <Text style={styles.rotateButtonIcon}>↻</Text>
          <Text style={styles.rotateButtonText}>Siguiente Mano</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tableArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    width: TABLE_WIDTH,
    height: TABLE_HEIGHT,
    backgroundColor: '#0d4f2e', // Casino green
    borderRadius: TABLE_WIDTH / 2, // Approximates an oval if height is different
    borderWidth: 10,
    borderColor: '#1a1f1c', // Dark outer rail
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  innerTableLine: {
    width: TABLE_WIDTH - 50,
    height: TABLE_HEIGHT - 50,
    borderRadius: (TABLE_WIDTH - 50) / 2,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
    position: 'absolute',
  },
  playerSpot: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  playerAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playerLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  buttonContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // To stack chips side by side if heads up
    flexWrap: 'wrap',
  },
  indicatorChip: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
    margin: 2,
  },
  dealerChip: {
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
  },
  sbChip: {
    backgroundColor: '#3b82f6', // Blue for SB
    borderColor: '#2563eb',
  },
  bbChip: {
    backgroundColor: '#eab308', // Yellow for BB
    borderColor: '#ca8a04',
  },
  dealerChipText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
  },
  blindChipText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  controls: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  rotateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  rotateButtonIcon: {
    color: '#ffffff',
    fontSize: 20,
    marginRight: 8,
    fontWeight: 'bold',
  },
  rotateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
