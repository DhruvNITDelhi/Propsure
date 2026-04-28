import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../../constants/theme';
import ScreenHeader from '../../components/ScreenHeader';
import StateSelector from '../../components/StateSelector';
import { generateOfflineRentalAgreement } from '../../utils/agreementTemplate';
import { validateRentalForm, ValidationError } from '../../utils/validation';
import { generateAndSharePdf, wrapInHtmlTemplate, rentalAgreementToHtml } from '../../utils/pdf';

const durationOptions = ['11 months', '1 year', '2 years'];
const noticeOptions = ['1 month', '2 months'];
const utilityOptions = ['Electricity', 'Water', 'Gas', 'Maintenance'];

export default function RentalScreen() {
  const router = useRouter();
  // No external API needed anymore

  const [form, setForm] = useState({
    landlordName: '',
    landlordAadhaar: '',
    tenantName: '',
    tenantAadhaar: '',
    address: '',
    city: '',
    state: '',
    rent: '',
    deposit: '',
    duration: '11 months',
    startDate: '',
    noticePeriod: '1 month',
    utilities: [] as string[],
    specialClauses: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedText, setGeneratedText] = useState('');
  const [showResult, setShowResult] = useState(false);

  const updateField = useCallback((field: string, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'rent' && !prev.deposit) {
        const rent = parseFloat(value.replace(/,/g, ''));
        if (!isNaN(rent)) {
          updated.deposit = String(rent * 2);
        }
      }
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [errors]);

  const toggleUtility = useCallback((utility: string) => {
    setForm((prev) => ({
      ...prev,
      utilities: prev.utilities.includes(utility)
        ? prev.utilities.filter((u) => u !== utility)
        : [...prev.utilities, utility],
    }));
  }, []);

  const handleGenerate = () => {
    const validationErrors = validateRentalForm(form as any);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((e: ValidationError) => {
        errorMap[e.field] = e.message;
      });
      setErrors(errorMap);
      return;
    }

    try {
      const details: any = {
        ...form,
        utilities: form.utilities.length > 0 ? form.utilities.join(', ') : 'None',
      };
      const result = generateOfflineRentalAgreement(details);
      setGeneratedText(result);
      setShowResult(true);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to generate agreement';
      Alert.alert('Error', message, [{ text: 'OK' }]);
    }
  };

  const handleDownloadPdf = async () => {
    if (!generatedText) return;
    const htmlContent = rentalAgreementToHtml(generatedText);
    await generateAndSharePdf(
      wrapInHtmlTemplate(htmlContent, 'Rental Agreement - PropSure'),
      'Rental_Agreement'
    );
  };

  const handleRegenerate = () => {
    setShowResult(false);
    setGeneratedText('');
  };

  const renderInput = (
    label: string,
    field: string,
    placeholder: string,
    options?: {
      multiline?: boolean;
      numeric?: boolean;
      prefix?: string;
      optional?: boolean;
    }
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label} {options?.optional && <Text style={styles.optional}>(optional)</Text>}
      </Text>
      <View style={[styles.inputContainer, options?.multiline && styles.multilineContainer]}>
        {options?.prefix && <Text style={styles.prefix}>{options.prefix}</Text>}
        <TextInput
          style={[styles.input, options?.multiline && styles.multiline]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={(form as any)[field]}
          onChangeText={(v) => updateField(field, v)}
          keyboardType={options?.numeric ? 'numeric' : 'default'}
          multiline={options?.multiline}
          numberOfLines={options?.multiline ? 3 : 1}
          textAlignVertical={options?.multiline ? 'top' : 'center'}
        />
      </View>
      {errors[label] && <Text style={styles.errorText}>{errors[label]}</Text>}
    </View>
  );

  if (showResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Generated Agreement" showBack />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{generatedText}</Text>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleRegenerate}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="refresh" size={18} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>Regenerate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleDownloadPdf}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="file-pdf-box" size={18} color={colors.surface} />
              <Text style={styles.primaryButtonText}>Download as PDF</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Rent Agreement" subtitle="Instant offline legal agreement" showBack />
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
          {/* Form Fields */}
          {renderInput('Landlord Name', 'landlordName', 'Full legal name of landlord')}
          {renderInput('Landlord Aadhaar', 'landlordAadhaar', 'XXXX-XXXX-XXXX', { optional: true, numeric: true })}
          {renderInput('Tenant Name', 'tenantName', 'Full legal name of tenant')}
          {renderInput('Tenant Aadhaar', 'tenantAadhaar', 'XXXX-XXXX-XXXX', { optional: true, numeric: true })}
          {renderInput('Property Address', 'address', 'Complete address of the property', { multiline: true })}
          {renderInput('City', 'city', 'City name')}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>State</Text>
            <StateSelector value={form.state} onChange={(v) => updateField('state', v)} />
            {errors['State'] && <Text style={styles.errorText}>{errors['State']}</Text>}
          </View>

          {renderInput('Monthly Rent', 'rent', '15000', { numeric: true, prefix: '₹' })}
          {renderInput('Security Deposit', 'deposit', '30000', { numeric: true, prefix: '₹' })}

          {/* Duration Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Agreement Duration</Text>
            <View style={styles.chipRow}>
              {durationOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, form.duration === opt && styles.chipSelected]}
                  onPress={() => updateField('duration', opt)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, form.duration === opt && styles.chipTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {renderInput('Start Date', 'startDate', 'e.g., 1st April 2025')}

          {/* Notice Period */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notice Period</Text>
            <View style={styles.chipRow}>
              {noticeOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, form.noticePeriod === opt && styles.chipSelected]}
                  onPress={() => updateField('noticePeriod', opt)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, form.noticePeriod === opt && styles.chipTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Utilities */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Utilities Included</Text>
            <View style={styles.chipRow}>
              {utilityOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, form.utilities.includes(opt) && styles.chipSelected]}
                  onPress={() => toggleUtility(opt)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      form.utilities.includes(opt) && styles.chipTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {renderInput('Special Clauses', 'specialClauses', 'Any additional terms...', {
            multiline: true,
            optional: true,
          })}

          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerate}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="file-sign" size={20} color={colors.surface} />
            <Text style={styles.generateButtonText}>Generate Agreement</Text>
          </TouchableOpacity>
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
    paddingBottom: spacing.xxl + 20,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.label,
    marginBottom: spacing.xs + 2,
  },
  optional: {
    color: colors.textMuted,
    fontWeight: '400',
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
  multilineContainer: {
    alignItems: 'flex-start',
    paddingTop: spacing.sm,
  },
  prefix: {
    ...typography.body,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.sm + 2,
  },
  multiline: {
    minHeight: 70,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  generateButtonText: {
    ...typography.h3,
    color: colors.surface,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  resultText: {
    ...typography.body,
    lineHeight: 22,
  },
  resultActions: {
    flexDirection: 'row',
    gap: spacing.sm + 4,
    marginTop: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    gap: spacing.xs,
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    gap: spacing.xs,
  },
  primaryButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
});
