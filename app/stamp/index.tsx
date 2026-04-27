import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { stampRates } from '../../constants/stampData';
import ScreenHeader from '../../components/ScreenHeader';
import StateSelector from '../../components/StateSelector';
import EmptyState from '../../components/EmptyState';
import { formatCurrency, parseCurrencyInput } from '../../utils/validation';

type PropertyType = 'residential' | 'commercial';
type BuyerType = 'male' | 'female' | 'joint';

const propertyTypes: { label: string; value: PropertyType }[] = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
];

const buyerTypes: { label: string; value: BuyerType }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Joint', value: 'joint' },
];

export default function StampDutyScreen() {
  const [selectedState, setSelectedState] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('residential');
  const [buyerType, setBuyerType] = useState<BuyerType>('male');

  const stateRates = selectedState ? stampRates[selectedState] : null;

  const calculation = useMemo(() => {
    if (!stateRates || !propertyValue) return null;

    const value = parseCurrencyInput(propertyValue);
    if (value <= 0) return null;

    const rates = stateRates[propertyType];
    const dutyPercent = rates[buyerType];
    const regPercent = rates.registrationFee;

    const stampDuty = (value * dutyPercent) / 100;
    let registrationFee = (value * regPercent) / 100;

    if (rates.maxRegistrationFee && registrationFee > rates.maxRegistrationFee) {
      registrationFee = rates.maxRegistrationFee;
    }

    const total = stampDuty + registrationFee;
    const effectivePercent = ((total / value) * 100).toFixed(2);

    return {
      stampDuty,
      registrationFee,
      total,
      effectivePercent,
      dutyPercent,
      regPercent,
      notes: rates.notes,
    };
  }, [stateRates, propertyValue, propertyType, buyerType]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Stamp Duty Calculator" subtitle="Estimate registration costs" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* State */}
          <StateSelector
            value={selectedState}
            onChange={setSelectedState}
            label="Select State"
          />

          {/* Property Value */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Property Value</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>₹</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 5000000"
                placeholderTextColor={colors.textMuted}
                value={propertyValue}
                onChangeText={setPropertyValue}
                keyboardType="numeric"
              />
            </View>
            {propertyValue && (
              <Text style={styles.amountInWords}>
                {formatCurrency(parseCurrencyInput(propertyValue))}
              </Text>
            )}
          </View>

          {/* Property Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Property Type</Text>
            <View style={styles.chipRow}>
              {propertyTypes.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, propertyType === opt.value && styles.chipSelected]}
                  onPress={() => setPropertyType(opt.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.chipText, propertyType === opt.value && styles.chipTextSelected]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Buyer Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Buyer Type</Text>
            <View style={styles.chipRow}>
              {buyerTypes.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, buyerType === opt.value && styles.chipSelected]}
                  onPress={() => setBuyerType(opt.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.chipText, buyerType === opt.value && styles.chipTextSelected]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Results */}
          {!selectedState ? (
            <EmptyState
              title="Select a state"
              subtitle="Choose your state and enter property value to calculate stamp duty"
              icon="calculator"
            />
          ) : !stateRates ? (
            <EmptyState
              title="Data not available"
              subtitle={`Stamp duty rates for ${selectedState} are coming soon. Please check back in a future update.`}
              icon="database-off-outline"
            />
          ) : calculation ? (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Estimated Costs</Text>

              {/* Metric Cards */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Stamp Duty</Text>
                  <Text style={styles.metricValue}>
                    {formatCurrency(calculation.stampDuty)}
                  </Text>
                  <Text style={styles.metricPercent}>{calculation.dutyPercent}%</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Registration Fee</Text>
                  <Text style={styles.metricValue}>
                    {formatCurrency(calculation.registrationFee)}
                  </Text>
                  <Text style={styles.metricPercent}>{calculation.regPercent}%</Text>
                </View>
              </View>

              {/* Total */}
              <View style={styles.totalCard}>
                <View>
                  <Text style={styles.totalLabel}>Total Transaction Cost</Text>
                  <Text style={styles.totalSubtext}>
                    Effective rate: {calculation.effectivePercent}%
                  </Text>
                </View>
                <Text style={styles.totalValue}>{formatCurrency(calculation.total)}</Text>
              </View>

              {/* Breakdown */}
              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownTitle}>Understanding the Charges</Text>
                <View style={styles.breakdownItem}>
                  <MaterialCommunityIcons name="stamper" size={16} color={colors.primary} />
                  <Text style={styles.breakdownText}>
                    <Text style={{ fontWeight: '600' }}>Stamp Duty</Text> is the tax paid to the state government for legally recording the property transaction document.
                  </Text>
                </View>
                <View style={styles.breakdownItem}>
                  <MaterialCommunityIcons name="bank" size={16} color={colors.primary} />
                  <Text style={styles.breakdownText}>
                    <Text style={{ fontWeight: '600' }}>Registration Fee</Text> is paid to the Sub-Registrar Office (SRO) for registering the sale deed.
                  </Text>
                </View>
                {calculation.notes && (
                  <View style={styles.notesBox}>
                    <MaterialCommunityIcons name="information-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.notesText}>{calculation.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <EmptyState
              title="Enter property value"
              subtitle="Enter the property value above to see the stamp duty and registration fee calculation"
              icon="calculator-variant-outline"
            />
          )}

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <MaterialCommunityIcons name="alert-circle-outline" size={14} color={colors.textMuted} />
            <Text style={styles.disclaimerText}>
              These are approximate rates. Actual charges depend on property location, government guidelines, and may include surcharges. Always verify with the SRO.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  inputGroup: {
    marginTop: spacing.md,
  },
  inputLabel: {
    ...typography.label,
    marginBottom: spacing.xs + 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  prefix: {
    ...typography.h3,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
  },
  amountInWords: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.caption,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.surface,
  },
  resultsSection: {
    marginTop: spacing.lg,
  },
  resultsTitle: {
    ...typography.h3,
    marginBottom: spacing.sm + 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  metricLabel: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  metricPercent: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm + 2,
  },
  totalLabel: {
    ...typography.h3,
    color: colors.surface,
  },
  totalSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.surface,
  },
  breakdownCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  breakdownTitle: {
    ...typography.h3,
    marginBottom: spacing.sm + 2,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  breakdownText: {
    ...typography.caption,
    flex: 1,
    lineHeight: 18,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.background,
    padding: spacing.sm + 2,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
  },
  notesText: {
    ...typography.caption,
    flex: 1,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.textMuted,
    flex: 1,
    lineHeight: 16,
  },
});
