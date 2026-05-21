import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder } from 'react-native';
import TableChip from './TableChip';

interface ChipStackProps {
  value: number;
  count: number;
  color: string;
  accentColor: string;
  label: string;
  onSwipeUp?: () => void;
}

const MAX_VISIBLE_CHIPS = 6;

/**
 * ChipStack - Renders a visual stack of poker chips with count and total value.
 * Shows overlapping chips stacked vertically to simulate a real chip stack.
 */
export default function ChipStack({ value, count, color, accentColor, label, onSwipeUp }: ChipStackProps) {
  // Show up to MAX_VISIBLE_CHIPS in the visual stack
  const visibleCount = Math.min(count, MAX_VISIBLE_CHIPS);
  const totalValue = value * count;

  // Animation for the top chip
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only claim responder if swiping vertically and there are chips to swipe
        return count > 0 && Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        // If swiped up more than 40px, trigger the bet
        if (gestureState.dy < -40 && onSwipeUp) {
          // Animate it flying off screen quickly
          Animated.timing(pan, {
            toValue: { x: 0, y: -400 },
            duration: 150,
            useNativeDriver: false,
          }).start(() => {
            onSwipeUp();
            // Instantly reset the pan position for the next chip
            pan.setValue({ x: 0, y: 0 });
          });
        } else {
          // Spring back to original position
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 5,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Visual chip stack */}
      <View style={styles.stackArea}>
        {Array.from({ length: visibleCount }, (_, i) => {
          const isTopChip = i === visibleCount - 1;
          const isStacked = !isTopChip;

          // Apply animation and panResponder only to the top chip
          if (isTopChip && count > 0) {
            return (
              <Animated.View
                key={i}
                {...panResponder.panHandlers}
                style={[
                  styles.stackedChip,
                  {
                    bottom: i * 5,
                    zIndex: i,
                    transform: pan.getTranslateTransform(),
                  },
                ]}
              >
                <TableChip
                  color={color}
                  accentColor={accentColor}
                  label={label}
                  isStacked={isStacked}
                />
              </Animated.View>
            );
          }

          return (
            <View
              key={i}
              style={[
                styles.stackedChip,
                {
                  bottom: i * 5,
                  zIndex: i,
                },
              ]}
            >
              <TableChip
                color={color}
                accentColor={accentColor}
                label={label}
                isStacked={isStacked}
              />
            </View>
          );
        })}
      </View>

      {/* Chip info */}
      <View style={styles.info}>
        <View style={[styles.valueBadge, { backgroundColor: color }]}>
          <Text style={styles.valueText}>{label}</Text>
        </View>
        <Text style={styles.countText}>×{count}</Text>
        <Text style={styles.totalText}>{totalValue.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 68,
  },
  stackArea: {
    height: 90,
    width: 56,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  stackedChip: {
    position: 'absolute',
  },
  info: {
    alignItems: 'center',
    marginTop: 8,
  },
  valueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  valueText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  countText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    fontWeight: '600',
  },
  totalText: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 10,
    marginTop: 2,
  },
});
