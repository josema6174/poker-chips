import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CHIP_SIZE = 52;
const DASH_COUNT = 10;

interface TableChipProps {
  color: string;
  accentColor: string;
  label: string;
  /** If true, renders a slightly smaller "stacked" version without the label */
  isStacked?: boolean;
}

/**
 * TableChip - A colored poker chip with a denomination label.
 * Used on the table screen to represent each chip type.
 */
export default function TableChip({ color, accentColor, label, isStacked = false }: TableChipProps) {
  const size = isStacked ? CHIP_SIZE - 4 : CHIP_SIZE;

  const dashes = Array.from({ length: DASH_COUNT }, (_, i) => {
    const angle = (360 / DASH_COUNT) * i;
    return (
      <View
        key={i}
        style={[
          styles.dashContainer,
          {
            width: 5,
            height: size,
            transform: [{ rotate: `${angle}deg` }],
          },
        ]}
      >
        <View style={[styles.dash, { backgroundColor: accentColor }]} />
      </View>
    );
  });

  return (
    <View style={[styles.chipOuter, { width: size + 4, height: size + 4 }]}>
      <View
        style={[
          styles.chipBody,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      >
        {dashes}

        {/* Inner ring */}
        <View
          style={[
            styles.innerRing,
            {
              width: size - 16,
              height: size - 16,
              borderRadius: (size - 16) / 2,
              borderColor: accentColor,
            },
          ]}
        >
          {!isStacked && (
            <Text style={styles.chipLabel} numberOfLines={1}>
              {label}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chipOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipBody: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  dashContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dash: {
    width: 5,
    height: 7,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: -1,
  },
  innerRing: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  chipLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
});
