import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';
import { allStatesAndUTs } from '../constants/states';

interface StateSelectorProps {
  value: string;
  onChange: (state: string) => void;
  label?: string;
}

const StateSelector: React.FC<StateSelectorProps> = ({ value, onChange, label }) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = allStatesAndUTs.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = useCallback(
    (state: string) => {
      onChange(state);
      setVisible(false);
      setSearch('');
    },
    [onChange]
  );

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <TouchableOpacity
        style={[styles.item, item === value && styles.itemSelected]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.6}
      >
        <MaterialCommunityIcons
          name="map-marker"
          size={18}
          color={item === value ? colors.primary : colors.textMuted}
        />
        <Text style={[styles.itemText, item === value && styles.itemTextSelected]}>
          {item}
        </Text>
        {item === value && (
          <MaterialCommunityIcons name="check" size={18} color={colors.primary} />
        )}
      </TouchableOpacity>
    ),
    [value, handleSelect]
  );

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={20}
          color={value ? colors.primary : colors.textMuted}
        />
        <Text style={[styles.selectorText, !value && styles.placeholder]}>
          {value || 'Select a state'}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setVisible(false);
          setSearch('');
        }}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select State</Text>
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                    setSearch('');
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
              <View style={styles.searchContainer}>
                <MaterialCommunityIcons name="magnify" size={20} color={colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search states..."
                  placeholderTextColor={colors.textMuted}
                  value={search}
                  onChangeText={setSearch}
                  autoFocus
                />
              </View>
              <FlatList
                data={filtered}
                keyExtractor={(item) => item}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    gap: spacing.sm,
  },
  selectorText: {
    ...typography.body,
    flex: 1,
  },
  placeholder: {
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '80%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.sm + 2,
  },
  listContent: {
    paddingHorizontal: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm + 2,
  },
  itemSelected: {
    backgroundColor: colors.primary + '0D',
  },
  itemText: {
    ...typography.body,
    flex: 1,
  },
  itemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default React.memo(StateSelector);
