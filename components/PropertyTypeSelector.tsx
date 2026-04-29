import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';

export type PropertyType = 'rural' | 'urban';

interface PropertyTypeSelectorProps {
  selected: PropertyType | null;
  onSelect: (type: PropertyType) => void;
  suggestion?: PropertyType | null;
  suggestionReason?: string;
}

const options: {
  type: PropertyType;
  icon: string;
  title: string;
  subtitle: string;
  examples: string;
}[] = [
  {
    type: 'rural',
    icon: 'home-group',
    title: 'Village / Farm Land',
    subtitle: 'Agricultural land, village plots, or land outside municipal limits',
    examples: 'Gata Number, Khasra, Khatauni, Jamabandi',
  },
  {
    type: 'urban',
    icon: 'city-variant',
    title: 'House / Flat in City or Town',
    subtitle: 'Property inside Nagar Palika, Nagar Nigam, or Municipal Corporation area',
    examples: 'Sale Deed, Property Tax ID, House Number',
  },
];

export default function PropertyTypeSelector({
  selected,
  onSelect,
  suggestion,
  suggestionReason,
}: PropertyTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>What type of property is this?</Text>

      {suggestion && suggestionReason && (
        <View style={styles.suggestionBanner}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={colors.warning} />
          <Text style={styles.suggestionText}>
            <Text style={styles.suggestionBold}>Our guess: </Text>
            {suggestionReason}
          </Text>
        </View>
      )}

      {options.map((opt) => {
        const isSelected = selected === opt.type;
        const isSuggested = suggestion === opt.type && !selected;

        return (
          <TouchableOpacity
            key={opt.type}
            style={[
              styles.card,
              isSelected && styles.cardSelected,
              isSuggested && !isSelected && styles.cardSuggested,
            ]}
            onPress={() => onSelect(opt.type)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  isSelected && styles.iconContainerSelected,
                ]}
              >
                <MaterialCommunityIcons
                  name={opt.icon as any}
                  size={26}
                  color={isSelected ? colors.surface : colors.primary}
                />
              </View>
              <View style={styles.cardText}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, isSelected && styles.titleSelected]}>
                    {opt.title}
                  </Text>
                  {isSuggested && (
                    <View style={styles.suggestedBadge}>
                      <Text style={styles.suggestedBadgeText}>Suggested</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.subtitle}>{opt.subtitle}</Text>
              </View>
              {isSelected && (
                <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />
              )}
            </View>
            <View style={styles.examplesRow}>
              <MaterialCommunityIcons name="file-document-outline" size={14} color={colors.textMuted} />
              <Text style={styles.examplesText}>Records: {opt.examples}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.helpNote}>
        <MaterialCommunityIcons name="help-circle-outline" size={16} color={colors.textMuted} />
        <Text style={styles.helpText}>
          Not sure? If your property is in a town or city with a Nagar Palika, choose "House/Flat". 
          If it's agricultural land or in a revenue village, choose "Village/Farm Land".
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  heading: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  suggestionBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warning + '12',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  suggestionText: {
    ...typography.body,
    flex: 1,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  suggestionBold: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  cardSuggested: {
    borderColor: colors.warning + '50',
    borderStyle: 'dashed',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary + '14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerSelected: {
    backgroundColor: colors.primary,
  },
  cardText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  title: {
    ...typography.h3,
  },
  titleSelected: {
    color: colors.primary,
  },
  suggestedBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  suggestedBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.warning,
    textTransform: 'uppercase',
  },
  subtitle: {
    ...typography.caption,
    lineHeight: 17,
    marginTop: 2,
  },
  examplesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  examplesText: {
    ...typography.caption,
    flex: 1,
    fontStyle: 'italic',
  },
  helpNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.xs,
  },
  helpText: {
    ...typography.caption,
    flex: 1,
    lineHeight: 17,
    color: colors.textMuted,
  },
});
