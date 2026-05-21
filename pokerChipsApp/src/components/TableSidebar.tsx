import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75; // 75% of screen width

interface TableSidebarProps {
  visible: boolean;
  onClose: () => void;
  activeTab: 'table' | 'history' | 'dealer';
  onSelectTab: (tab: 'table' | 'history' | 'dealer') => void;
  onLeaveTable: () => void;
}

export default function TableSidebar({
  visible,
  onClose,
  activeTab,
  onSelectTab,
  onLeaveTable,
}: TableSidebarProps) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Wrapper for onClose to allow animations to finish if needed, 
  // but Modal component handles unmounting. We keep it simple.
  const handleClose = () => {
    onClose();
  };

  const handleTabPress = (tab: 'table' | 'history' | 'dealer') => {
    onSelectTab(tab);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </TouchableWithoutFeedback>

        {/* Sidebar Panel */}
        <Animated.View
          style={[
            styles.sidebar,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Menú</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuItems}>
            <TouchableOpacity
              style={[
                styles.menuItem,
                activeTab === 'table' && styles.menuItemActive,
              ]}
              onPress={() => handleTabPress('table')}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemIcon}>♠</Text>
              <Text
                style={[
                  styles.menuItemText,
                  activeTab === 'table' && styles.menuItemTextActive,
                ]}
              >
                Mesa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                activeTab === 'dealer' && styles.menuItemActive,
              ]}
              onPress={() => handleTabPress('dealer')}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemIcon}>D</Text>
              <Text
                style={[
                  styles.menuItemText,
                  activeTab === 'dealer' && styles.menuItemTextActive,
                ]}
              >
                Dealer Button
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                activeTab === 'history' && styles.menuItemActive,
              ]}
              onPress={() => handleTabPress('history')}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemIcon}></Text>
              <Text
                style={[
                  styles.menuItemText,
                  activeTab === 'history' && styles.menuItemTextActive,
                ]}
              >
                Historial de Apuestas
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={() => {
                handleClose();
                onLeaveTable();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.leaveIcon}></Text>
              <Text style={styles.leaveText}>Salir de la mesa</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#111a12',
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 60, // Safe area approx
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 20,
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 12,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  menuItemIcon: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 20,
    width: 32,
  },
  menuItemText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemTextActive: {
    color: '#22c55e',
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  leaveIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  leaveText: {
    color: '#f87171',
    fontSize: 16,
    fontWeight: '700',
  },
});
