import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

interface JoinTableModalProps {
  visible: boolean;
  onClose: () => void;
  onJoinTable: (code: string) => void;
}

/**
 * JoinTableModal - Modal for joining an existing poker table.
 * The user enters an alphanumeric table code to join.
 */
export default function JoinTableModal({
  visible,
  onClose,
  onJoinTable,
}: JoinTableModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Animations
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setCode('');
      setError('');
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
      ]).start(() => {
        // Auto-focus the input after animation
        inputRef.current?.focus();
      });
    } else {
      backdropOpacity.setValue(0);
      slideAnim.setValue(300);
    }
  }, [visible]);

  const handleClose = () => {
    Keyboard.dismiss();
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

  const handleJoin = () => {
    if (code.trim().length === 0) {
      setError('Ingresá un código de mesa');
      return;
    }
    if (code.trim().length < 4) {
      setError('El código debe tener al menos 4 caracteres');
      return;
    }
    Keyboard.dismiss();
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
    ]).start(() => onJoinTable(code.trim()));
  };

  const handleCodeChange = (text: string) => {
    // Allow alphanumeric input only, convert to uppercase
    const cleanText = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setCode(cleanText);
    if (error) setError('');
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

      {/* Modal Content - KeyboardAvoidingView pushes content above keyboard */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                <Text style={styles.headerIcon}>♣</Text>
                <Text style={styles.headerTitle}>Ingresar a Mesa</Text>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Description */}
              <Text style={styles.description}>
                Ingresá el código que te compartió el creador de la mesa.
              </Text>

              {/* Code Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Código de Mesa</Text>
                <View style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}>
                  <Text style={styles.inputPrefix}>#</Text>
                  <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={code}
                    onChangeText={handleCodeChange}
                    placeholder="ABC123"
                    placeholderTextColor="rgba(255, 255, 255, 0.15)"
                    keyboardType="default"
                    autoCapitalize="characters"
                    autoCorrect={false}
                    maxLength={8}
                    returnKeyType="join"
                    onSubmitEditing={handleJoin}
                  />
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              {/* Join Button */}
              <TouchableOpacity
                style={[styles.joinButton, code.length < 4 && styles.joinButtonDisabled]}
                activeOpacity={0.8}
                onPress={handleJoin}
              >
                <Text style={styles.joinButtonText}>Unirse a la Mesa</Text>
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
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
    marginBottom: 20,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 28,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
  },
  inputPrefix: {
    color: '#22c55e',
    fontSize: 22,
    fontWeight: '700',
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 4,
    padding: 0,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
  },
  joinButton: {
    backgroundColor: '#166534',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  joinButtonDisabled: {
    opacity: 0.5,
  },
  joinButtonText: {
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
