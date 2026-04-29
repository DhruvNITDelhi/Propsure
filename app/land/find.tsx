import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { getStatePortalData, StatePortalData } from '../../constants/landData';
import { analyzePincode } from '../../constants/pincodeData';
import StepIndicator from '../../components/StepIndicator';
import MapPicker, { SelectedLocation } from '../../components/MapPicker';
import PropertyTypeSelector, { PropertyType } from '../../components/PropertyTypeSelector';
import ScreenHeader from '../../components/ScreenHeader';

const STEPS = ['Location', 'Type', 'Records'];

// Reverse geocode using OSM Nominatim (free, no key)
async function reverseGeocode(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=en`,
      { headers: { 'User-Agent': 'PropSure/1.0' } }
    );
    return await res.json();
  } catch { return null; }
}

// Map OSM state names to our portal keys
function normalizeState(osmState: string): string {
  const map: Record<string, string> = {
    'uttar pradesh': 'Uttar Pradesh',
    'maharashtra': 'Maharashtra',
    'karnataka': 'Karnataka',
    'rajasthan': 'Rajasthan',
    'madhya pradesh': 'Madhya Pradesh',
    'bihar': 'Bihar',
    'haryana': 'Haryana',
    'punjab': 'Punjab',
    'gujarat': 'Gujarat',
    'tamil nadu': 'Tamil Nadu',
    'telangana': 'Telangana',
    'kerala': 'Kerala',
    'west bengal': 'West Bengal',
    'odisha': 'Odisha',
    'delhi': 'Delhi',
    'nct of delhi': 'Delhi',
    'himachal pradesh': 'Himachal Pradesh',
    'uttarakhand': 'Uttarakhand',
    'chhattisgarh': 'Chhattisgarh',
    'jharkhand': 'Jharkhand',
    'assam': 'Assam',
    'andhra pradesh': 'Andhra Pradesh',
    'goa': 'Goa',
    'tripura': 'Tripura',
  };
  return map[osmState.toLowerCase()] || osmState;
}

interface GeoResult {
  state: string;
  district: string;
  city: string;
  village: string;
  postcode: string;
  displayName: string;
}

export default function FindPropertyScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1 state
  const [useMap, setUseMap] = useState(true);
  const [pincode, setPincode] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [geoResult, setGeoResult] = useState<GeoResult | null>(null);

  // Step 2 state
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [suggestion, setSuggestion] = useState<PropertyType | null>(null);
  const [suggestionReason, setSuggestionReason] = useState('');

  // Step 3 state
  const [portalData, setPortalData] = useState<StatePortalData | null>(null);

  // ── Step 1: Handle location from map ──
  const handleLocationFromMap = useCallback(async (loc: SelectedLocation) => {
    setGeocoding(true);
    const data = await reverseGeocode(loc.latitude, loc.longitude);
    setGeocoding(false);

    if (!data || !data.address) {
      Alert.alert('Could not identify location', 'Please try a different spot or enter your PIN code manually.');
      return;
    }

    const addr = data.address;
    const state = normalizeState(addr.state || '');
    const result: GeoResult = {
      state,
      district: addr.county || addr.state_district || addr.city_district || '',
      city: addr.city || addr.town || addr.municipality || '',
      village: addr.village || addr.suburb || addr.neighbourhood || '',
      postcode: addr.postcode || '',
      displayName: data.display_name || '',
    };
    setGeoResult(result);

    // Auto-detect urban/rural
    const analysis = analyzePincode(result.postcode, state);
    if (analysis.type !== 'unknown') {
      setSuggestion(analysis.type);
      setSuggestionReason(analysis.reason);
    } else if (result.city) {
      setSuggestion('urban');
      setSuggestionReason(`"${result.city}" appears to be a town/city area`);
    } else if (result.village && !result.city) {
      setSuggestion('rural');
      setSuggestionReason(`"${result.village}" appears to be a village area`);
    }

    // Load portal data
    const pd = getStatePortalData(state);
    setPortalData(pd);

    setStep(1);
  }, []);

  // ── Step 1: Handle PIN code entry ──
  const handlePincodeSearch = useCallback(async () => {
    if (pincode.length !== 6) {
      Alert.alert('Invalid PIN code', 'Please enter a valid 6-digit PIN code.');
      return;
    }
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&addressdetails=1&accept-language=en&limit=1`,
        { headers: { 'User-Agent': 'PropSure/1.0' } }
      );
      const results = await res.json();
      if (results.length === 0) {
        Alert.alert('PIN code not found', 'Could not find location for this PIN code. Try dropping a pin on the map instead.');
        setGeocoding(false);
        return;
      }
      const data = results[0];
      const addr = data.address || {};
      const state = normalizeState(addr.state || '');
      const result: GeoResult = {
        state,
        district: addr.county || addr.state_district || addr.city_district || '',
        city: addr.city || addr.town || addr.municipality || '',
        village: addr.village || addr.suburb || addr.neighbourhood || '',
        postcode: pincode,
        displayName: data.display_name || '',
      };
      setGeoResult(result);

      const analysis = analyzePincode(pincode, state);
      if (analysis.type !== 'unknown') {
        setSuggestion(analysis.type);
        setSuggestionReason(analysis.reason);
      } else if (result.city) {
        setSuggestion('urban');
        setSuggestionReason(`"${result.city}" appears to be a town/city area`);
      }

      const pd = getStatePortalData(state);
      setPortalData(pd);
      setStep(1);
    } catch {
      Alert.alert('Network error', 'Could not look up PIN code. Check your internet connection.');
    }
    setGeocoding(false);
  }, [pincode]);

  // ── Step 2 → 3 ──
  const handleTypeConfirm = useCallback(() => {
    if (!propertyType) {
      Alert.alert('Please select', 'Choose whether your property is in a village or a city/town.');
      return;
    }
    setStep(2);
  }, [propertyType]);

  const openUrl = (url: string) => Linking.openURL(url).catch(() => {});

  // ── RENDER ──
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Find My Property"
        subtitle="Guided search — no documents needed"
      />
      <StepIndicator steps={STEPS} currentStep={step} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ═══ STEP 0: LOCATION ═══ */}
        {step === 0 && (
          <View style={styles.stepContainer}>
            {/* Toggle: Map vs Pincode */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, useMap && styles.toggleBtnActive]}
                onPress={() => setUseMap(true)}
              >
                <MaterialCommunityIcons name="map-marker" size={18} color={useMap ? colors.surface : colors.primary} />
                <Text style={[styles.toggleText, useMap && styles.toggleTextActive]}>Drop Pin on Map</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, !useMap && styles.toggleBtnActive]}
                onPress={() => setUseMap(false)}
              >
                <MaterialCommunityIcons name="numeric" size={18} color={!useMap ? colors.surface : colors.primary} />
                <Text style={[styles.toggleText, !useMap && styles.toggleTextActive]}>Enter PIN Code</Text>
              </TouchableOpacity>
            </View>

            {useMap ? (
              <MapPicker onLocationSelect={handleLocationFromMap} />
            ) : (
              <View style={styles.pincodeSection}>
                <Text style={styles.pincodeLabel}>Enter your area PIN code</Text>
                <View style={styles.pincodeRow}>
                  <TextInput
                    style={styles.pincodeInput}
                    value={pincode}
                    onChangeText={(t) => setPincode(t.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="e.g. 262701"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                  <TouchableOpacity
                    style={[styles.pincodeBtn, pincode.length !== 6 && styles.pincodeBtnDisabled]}
                    onPress={handlePincodeSearch}
                    disabled={pincode.length !== 6 || geocoding}
                  >
                    {geocoding ? (
                      <ActivityIndicator size="small" color={colors.surface} />
                    ) : (
                      <MaterialCommunityIcons name="magnify" size={22} color={colors.surface} />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.pincodeHint}>
                  💡 Don't know your PIN code? Switch to "Drop Pin on Map" above.
                </Text>
              </View>
            )}

            {geocoding && useMap && (
              <View style={styles.geocodingOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.geocodingText}>Identifying your location...</Text>
              </View>
            )}
          </View>
        )}

        {/* ═══ STEP 1: PROPERTY TYPE ═══ */}
        {step === 1 && geoResult && (
          <View style={styles.stepContainer}>
            {/* Location summary */}
            <View style={styles.locationSummary}>
              <MaterialCommunityIcons name="map-marker-check" size={22} color={colors.success} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationTitle}>
                  {geoResult.city || geoResult.village || geoResult.district}
                </Text>
                <Text style={styles.locationSubtitle}>
                  {[geoResult.district, geoResult.state].filter(Boolean).join(', ')}
                  {geoResult.postcode ? ` — ${geoResult.postcode}` : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => { setStep(0); setGeoResult(null); }}>
                <MaterialCommunityIcons name="pencil" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <PropertyTypeSelector
              selected={propertyType}
              onSelect={setPropertyType}
              suggestion={suggestion}
              suggestionReason={suggestionReason}
            />

            <TouchableOpacity
              style={[styles.nextButton, !propertyType && styles.nextButtonDisabled]}
              onPress={handleTypeConfirm}
              disabled={!propertyType}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Find Records</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color={colors.surface} />
            </TouchableOpacity>
          </View>
        )}

        {/* ═══ STEP 2: RESULTS ═══ */}
        {step === 2 && geoResult && (
          <View style={styles.stepContainer}>
            {/* Location + type summary */}
            <View style={styles.resultHeader}>
              <View style={styles.resultBadge}>
                <MaterialCommunityIcons
                  name={propertyType === 'rural' ? 'home-group' : 'city-variant'}
                  size={16}
                  color={colors.surface}
                />
                <Text style={styles.resultBadgeText}>
                  {propertyType === 'rural' ? 'Rural / Village' : 'Urban / City'}
                </Text>
              </View>
              <Text style={styles.resultLocation}>
                {geoResult.city || geoResult.village || geoResult.district}, {geoResult.state}
              </Text>
            </View>

            {portalData ? (
              <>
                {/* Portal cards */}
                {propertyType === 'rural' ? (
                  <>
                    {/* BhuNaksha */}
                    {portalData.rural.bhuNaksha && (
                      <View style={styles.portalCard}>
                        <View style={styles.portalStep}>
                          <View style={styles.portalStepCircle}>
                            <Text style={styles.portalStepNum}>1</Text>
                          </View>
                          <Text style={styles.portalStepLabel}>Find Your Plot Number</Text>
                        </View>
                        <Text style={styles.portalName}>{portalData.rural.bhuNaksha.name}</Text>
                        <Text style={styles.portalDesc}>
                          Open this visual map portal. Navigate to your village and click on your plot to get the Gata/Khasra number.
                        </Text>
                        <Text style={styles.portalSearch}>
                          How to search: {portalData.rural.bhuNaksha.searchBy}
                        </Text>
                        <TouchableOpacity style={styles.openBtn} onPress={() => openUrl(portalData.rural.bhuNaksha!.url)}>
                          <MaterialCommunityIcons name="open-in-new" size={16} color={colors.surface} />
                          <Text style={styles.openBtnText}>Open {portalData.rural.bhuNaksha.name}</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Bhulekh */}
                    <View style={styles.portalCard}>
                      <View style={styles.portalStep}>
                        <View style={styles.portalStepCircle}>
                          <Text style={styles.portalStepNum}>{portalData.rural.bhuNaksha ? '2' : '1'}</Text>
                        </View>
                        <Text style={styles.portalStepLabel}>Get Owner Details</Text>
                      </View>
                      <Text style={styles.portalName}>{portalData.rural.landRecord.name}</Text>
                      <Text style={styles.portalDesc}>
                        Enter your Gata/Khasra number here to see the full ownership record (Khatauni).
                      </Text>
                      <Text style={styles.portalSearch}>
                        How to search: {portalData.rural.landRecord.searchBy}
                      </Text>
                      <TouchableOpacity style={styles.openBtn} onPress={() => openUrl(portalData.rural.landRecord.url)}>
                        <MaterialCommunityIcons name="open-in-new" size={16} color={colors.surface} />
                        <Text style={styles.openBtnText}>Open {portalData.rural.landRecord.name}</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    {/* Registration / IGRSUP */}
                    <View style={styles.portalCard}>
                      <View style={styles.portalStep}>
                        <View style={styles.portalStepCircle}>
                          <Text style={styles.portalStepNum}>1</Text>
                        </View>
                        <Text style={styles.portalStepLabel}>Search Registered Deeds</Text>
                      </View>
                      <Text style={styles.portalName}>{portalData.urban.registration.name}</Text>
                      <Text style={styles.portalDesc}>
                        Search for registered sale deeds, gift deeds, or other documents. You can search by your name or the seller's name — no document number required.
                      </Text>
                      <Text style={styles.portalSearch}>
                        How to search: {portalData.urban.registration.searchBy}
                      </Text>
                      <TouchableOpacity style={styles.openBtn} onPress={() => openUrl(portalData.urban.registration.url)}>
                        <MaterialCommunityIcons name="open-in-new" size={16} color={colors.surface} />
                        <Text style={styles.openBtnText}>Open {portalData.urban.registration.name}</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Municipal */}
                    {portalData.urban.municipal && (
                      <View style={styles.portalCard}>
                        <View style={styles.portalStep}>
                          <View style={styles.portalStepCircle}>
                            <Text style={styles.portalStepNum}>2</Text>
                          </View>
                          <Text style={styles.portalStepLabel}>Check Municipal Records</Text>
                        </View>
                        <Text style={styles.portalName}>{portalData.urban.municipal.name}</Text>
                        <Text style={styles.portalDesc}>
                          Search your Nagar Palika / Municipal Corporation records for property tax details and house ownership.
                        </Text>
                        <Text style={styles.portalSearch}>
                          How to search: {portalData.urban.municipal.searchBy}
                        </Text>
                        <TouchableOpacity style={styles.openBtn} onPress={() => openUrl(portalData.urban.municipal!.url)}>
                          <MaterialCommunityIcons name="open-in-new" size={16} color={colors.surface} />
                          <Text style={styles.openBtnText}>Open {portalData.urban.municipal.name}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}

                {/* No docs? section */}
                <View style={styles.noDocsCard}>
                  <View style={styles.noDocsHeader}>
                    <MaterialCommunityIcons name="help-circle" size={22} color={colors.accent} />
                    <Text style={styles.noDocsTitle}>Don't have any documents?</Text>
                  </View>
                  <Text style={styles.noDocsSubtitle}>
                    Here's how to find your property records from scratch:
                  </Text>
                  {portalData.noDocsTips.map((tip, i) => (
                    <View key={i} style={styles.tipRow}>
                      <View style={styles.tipBullet}>
                        <Text style={styles.tipBulletText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.noDataCard}>
                <MaterialCommunityIcons name="alert-circle-outline" size={32} color={colors.warning} />
                <Text style={styles.noDataText}>
                  We don't have portal data for {geoResult.state} yet. Please check your state's revenue department website or visit your local Tehsil office.
                </Text>
              </View>
            )}

            {/* Start over */}
            <TouchableOpacity
              style={styles.restartBtn}
              onPress={() => { setStep(0); setGeoResult(null); setPropertyType(null); }}
            >
              <MaterialCommunityIcons name="restart" size={18} color={colors.primary} />
              <Text style={styles.restartText}>Search Another Property</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  stepContainer: { gap: spacing.md },
  // Toggle
  toggleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs },
  toggleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, paddingVertical: spacing.sm + 2, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.surface,
  },
  toggleBtnActive: { backgroundColor: colors.primary },
  toggleText: { ...typography.body, fontWeight: '600', color: colors.primary },
  toggleTextActive: { color: colors.surface },
  // Pincode
  pincodeSection: { gap: spacing.sm },
  pincodeLabel: { ...typography.h3 },
  pincodeRow: { flexDirection: 'row', gap: spacing.sm },
  pincodeInput: {
    flex: 1, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4,
    fontSize: 18, fontWeight: '600', color: colors.textPrimary, letterSpacing: 4,
  },
  pincodeBtn: {
    width: 52, borderRadius: radius.md, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  pincodeBtnDisabled: { backgroundColor: colors.textMuted, opacity: 0.5 },
  pincodeHint: { ...typography.caption, lineHeight: 18 },
  // Geocoding
  geocodingOverlay: {
    alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg,
  },
  geocodingText: { ...typography.body, color: colors.textSecondary },
  // Location summary
  locationSummary: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.success + '10',
    padding: spacing.md, borderRadius: radius.lg, gap: spacing.sm,
    borderWidth: 1, borderColor: colors.success + '30',
  },
  locationInfo: { flex: 1 },
  locationTitle: { ...typography.h3, color: colors.textPrimary },
  locationSubtitle: { ...typography.caption, marginTop: 2 },
  // Next button
  nextButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, paddingVertical: spacing.md - 2,
    borderRadius: radius.md, gap: spacing.sm, marginTop: spacing.sm,
  },
  nextButtonDisabled: { backgroundColor: colors.textMuted, opacity: 0.5 },
  nextButtonText: { ...typography.body, color: colors.surface, fontWeight: '600' },
  // Results
  resultHeader: { alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  resultBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.primary, paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2, borderRadius: radius.full,
  },
  resultBadgeText: { ...typography.caption, color: colors.surface, fontWeight: '600' },
  resultLocation: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  // Portal card
  portalCard: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md, gap: spacing.sm,
  },
  portalStep: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  portalStepCircle: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  portalStepNum: { fontSize: 13, fontWeight: '700', color: colors.surface },
  portalStepLabel: { ...typography.label, color: colors.primary, fontWeight: '600' },
  portalName: { ...typography.h3 },
  portalDesc: { ...typography.body, color: colors.textSecondary, lineHeight: 21 },
  portalSearch: {
    ...typography.caption, backgroundColor: colors.primary + '0A',
    paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm, overflow: 'hidden', lineHeight: 17,
  },
  openBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, paddingVertical: spacing.sm + 2,
    borderRadius: radius.md, gap: spacing.xs + 2,
  },
  openBtnText: { ...typography.body, color: colors.surface, fontWeight: '600' },
  // No docs
  noDocsCard: {
    backgroundColor: colors.accent + '08', borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.accent + '25', padding: spacing.md, gap: spacing.sm,
  },
  noDocsHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  noDocsTitle: { ...typography.h3, color: colors.accent },
  noDocsSubtitle: { ...typography.body, color: colors.textSecondary },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  tipBullet: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent + '18',
    justifyContent: 'center', alignItems: 'center', marginTop: 1,
  },
  tipBulletText: { fontSize: 11, fontWeight: '700', color: colors.accent },
  tipText: { ...typography.body, flex: 1, lineHeight: 20, color: colors.textSecondary },
  // No data
  noDataCard: {
    alignItems: 'center', gap: spacing.sm, backgroundColor: colors.warning + '10',
    padding: spacing.lg, borderRadius: radius.lg,
  },
  noDataText: { ...typography.body, textAlign: 'center', color: colors.textSecondary, lineHeight: 21 },
  // Restart
  restartBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, paddingVertical: spacing.md, marginTop: spacing.sm,
  },
  restartText: { ...typography.body, color: colors.primary, fontWeight: '600' },
});
