import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CHIP_SIZE = 220;
const DASH_COUNT = 16;
const DASH_WIDTH = 14;
const DASH_HEIGHT = 22;

/**
 * PokerChip - Renders a realistic poker chip using only native React Native Views.
 * Black chip with white edge dashes, concentric rings, and centered text.
 */
export default function PokerChip() {
  // Generate the edge dashes positioned around the chip circumference
  const dashes = Array.from({ length: DASH_COUNT }, (_, i) => {
    const angle = (360 / DASH_COUNT) * i;
    return (
      <View
        key={i}
        style={[
          styles.dashContainer,
          { transform: [{ rotate: `${angle}deg` }] },
        ]}
      >
        <View style={styles.dash} />
      </View>
    );
  });

  return (
    <View style={styles.chipWrapper}>
      {/* Outer shadow layer */}
      <View style={styles.outerShadow}>
        {/* Main chip body */}
        <View style={styles.chipBody}>
          {/* Edge dashes */}
          {dashes}

          {/* Outer ring */}
          <View style={styles.outerRing}>
            {/* Inner decorative ring */}
            <View style={styles.innerRing}>
              {/* Center area */}
              <View style={styles.centerCircle}>
                <Text style={styles.titleTop}>POKER</Text>
                <View style={styles.dividerLine} />
                <Text style={styles.titleBottom}>CHIPS</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chipWrapper: {
    width: CHIP_SIZE + 20,
    height: CHIP_SIZE + 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerShadow: {
    width: CHIP_SIZE + 8,
    height: CHIP_SIZE + 8,
    borderRadius: (CHIP_SIZE + 8) / 2,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 20,
  },
  chipBody: {
    width: CHIP_SIZE,
    height: CHIP_SIZE,
    borderRadius: CHIP_SIZE / 2,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#333',
    overflow: 'hidden',
  },
  dashContainer: {
    position: 'absolute',
    width: DASH_WIDTH,
    height: CHIP_SIZE,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dash: {
    width: DASH_WIDTH,
    height: DASH_HEIGHT,
    backgroundColor: '#e8e8e8',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    marginTop: -2,
  },
  outerRing: {
    width: CHIP_SIZE - 52,
    height: CHIP_SIZE - 52,
    borderRadius: (CHIP_SIZE - 52) / 2,
    borderWidth: 2,
    borderColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  innerRing: {
    width: CHIP_SIZE - 68,
    height: CHIP_SIZE - 68,
    borderRadius: (CHIP_SIZE - 68) / 2,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCircle: {
    width: CHIP_SIZE - 90,
    height: CHIP_SIZE - 90,
    borderRadius: (CHIP_SIZE - 90) / 2,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  titleTop: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 5,
    textAlign: 'center',
  },
  dividerLine: {
    width: 50,
    height: 1.5,
    backgroundColor: '#e8e8e8',
    marginVertical: 4,
  },
  titleBottom: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 7,
    textAlign: 'center',
  },
});
