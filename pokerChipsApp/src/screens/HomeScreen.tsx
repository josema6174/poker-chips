import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PokerChip from '../components/PokerChip';
import CreateTableModal from '../components/CreateTableModal';
import JoinTableModal from '../components/JoinTableModal';

const { width } = Dimensions.get('window');

/**
 * HomeScreen - The main landing screen of the Poker Chips app.
 * Displays an animated poker chip logo and a "Crear Mesa" button.
 * Uses React Native's built-in Animated API (no Reanimated dependency).
 */
export default function HomeScreen() {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  // Animation values using RN's built-in Animated
  const chipScale = useRef(new Animated.Value(0.3)).current;
  const chipOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(40)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Chip entrance animation
    Animated.parallel([
      Animated.timing(chipOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(chipScale, {
        toValue: 1,
        damping: 12,
        stiffness: 90,
        mass: 1,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtitle fade in (delayed)
    Animated.timing(subtitleOpacity, {
      toValue: 1,
      duration: 500,
      delay: 500,
      useNativeDriver: true,
    }).start();

    // Button slide up (delayed)
    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        delay: 700,
        useNativeDriver: true,
      }),
      Animated.spring(buttonTranslateY, {
        toValue: 0,
        damping: 14,
        stiffness: 100,
        delay: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleOpenCreateModal = () => {
    setCreateModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const handleCreateTable = (players: number, stack: number) => {
    setCreateModalVisible(false);
    // TODO: Navigate to table screen with config
    console.log(`Mesa creada: ${players} jugadores, ${stack} fichas c/u`);
  };

  const handleOpenJoinModal = () => {
    setJoinModalVisible(true);
  };

  const handleCloseJoinModal = () => {
    setJoinModalVisible(false);
  };

  const handleJoinTable = (code: string) => {
    setJoinModalVisible(false);
    // TODO: Connect to existing table with code
    console.log(`Ingresando a mesa con código: ${code}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background decorative elements */}
      <View style={styles.bgGlow} />

      {/* Main content */}
      <View style={styles.content}>
        {/* Poker Chip Logo */}
        <Animated.View
          style={[
            styles.chipContainer,
            {
              opacity: chipOpacity,
              transform: [{ scale: chipScale }],
            },
          ]}
        >
          <PokerChip />
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}>
          <Text style={styles.subtitle}>Tus fichas, en tu celular</Text>
        </Animated.View>

        {/* Create Table Button */}
        <Animated.View
          style={[
            styles.buttonWrapper,
            {
              opacity: buttonOpacity,
              transform: [{ translateY: buttonTranslateY }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.createButton}
            activeOpacity={0.8}
            onPress={handleOpenCreateModal}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.buttonIcon}>♠</Text>
              <Text style={styles.buttonText}>Crear Mesa</Text>
            </View>
          </TouchableOpacity>

          {/* Join Table Button */}
          <TouchableOpacity
            style={styles.joinButton}
            activeOpacity={0.8}
            onPress={handleOpenJoinModal}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.joinButtonIcon}>♣</Text>
              <Text style={styles.joinButtonText}>Ingresar a Mesa</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Create Table Modal */}
      <CreateTableModal
        visible={createModalVisible}
        onClose={handleCloseCreateModal}
        onCreateTable={handleCreateTable}
      />

      {/* Join Table Modal */}
      <JoinTableModal
        visible={joinModalVisible}
        onClose={handleCloseJoinModal}
        onJoinTable={handleJoinTable}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1b0e',
  },
  bgGlow: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(22, 101, 52, 0.15)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  chipContainer: {
    marginBottom: 16,
  },
  subtitleContainer: {
    marginBottom: 48,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 280,
    gap: 14,
  },
  createButton: {
    backgroundColor: '#166534',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  joinButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonIcon: {
    color: '#ffffff',
    fontSize: 22,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  joinButtonIcon: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 22,
  },
  joinButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 12,
  },
});
