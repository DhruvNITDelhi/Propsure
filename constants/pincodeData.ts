/**
 * Lightweight urban/rural detection based on PIN code patterns.
 * This is a heuristic — the user can always override.
 * 
 * Indian PIN code structure: XYZABC
 *  X = region (1-8)
 *  Y = sub-region / state
 *  Z = sorting district
 *  ABC = delivery office
 * 
 * General heuristic: PIN codes ending in 001 are usually GPO (General Post Office)
 * in district HQ cities. Lower last-3 digits often indicate urban areas.
 */

// Known municipal/urban PIN code ranges for major states
// These are PIN prefixes known to be Nagar Palika / Nagar Nigam areas
const KNOWN_URBAN_PINS: Record<string, string[]> = {
  'Uttar Pradesh': [
    '201', // Ghaziabad, Noida
    '208', // Kanpur
    '211', // Allahabad/Prayagraj
    '221', // Varanasi
    '226', // Lucknow
    '250', // Meerut
    '282', // Agra
    '231', // Mirzapur urban
    '262', // Lakhimpur Kheri (city areas)
  ],
  'Maharashtra': [
    '400', // Mumbai
    '411', // Pune
    '440', // Nagpur
    '431', // Aurangabad
    '422', // Nashik
  ],
  'Karnataka': [
    '560', // Bangalore
    '570', // Mysore
    '580', // Hubli/Dharwad
  ],
  'Delhi': [
    '110', // All Delhi
  ],
  'Tamil Nadu': [
    '600', // Chennai
    '641', // Coimbatore
    '625', // Madurai
  ],
  'Telangana': [
    '500', // Hyderabad
    '501', // Hyderabad suburbs
    '506', // Warangal
  ],
  'Gujarat': [
    '380', // Ahmedabad
    '390', // Vadodara
    '395', // Surat
  ],
  'Rajasthan': [
    '302', // Jaipur
    '342', // Jodhpur
    '313', // Udaipur
  ],
  'West Bengal': [
    '700', // Kolkata
    '711', // Howrah
  ],
  'Bihar': [
    '800', // Patna
    '842', // Muzaffarpur
  ],
  'Madhya Pradesh': [
    '462', // Bhopal
    '452', // Indore
    '482', // Jabalpur
  ],
};

export type LocationType = 'urban' | 'rural' | 'unknown';

export interface PincodeAnalysis {
  type: LocationType;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

/**
 * Analyze a PIN code to guess whether the location is urban or rural.
 * This is a heuristic — the user should always be able to override.
 */
export function analyzePincode(pincode: string, state?: string): PincodeAnalysis {
  const pin = pincode.trim();

  if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    return { type: 'unknown', confidence: 'low', reason: 'Invalid PIN code' };
  }

  const prefix3 = pin.substring(0, 3);
  const lastThree = parseInt(pin.substring(3), 10);

  // Check known urban PINs for the state
  if (state && KNOWN_URBAN_PINS[state]) {
    const isKnownUrban = KNOWN_URBAN_PINS[state].includes(prefix3);
    if (isKnownUrban) {
      return {
        type: 'urban',
        confidence: 'high',
        reason: `PIN ${pin} is in a known city/town area`,
      };
    }
  }

  // Check across all states if state is not provided
  if (!state) {
    for (const [, prefixes] of Object.entries(KNOWN_URBAN_PINS)) {
      if (prefixes.includes(prefix3)) {
        return {
          type: 'urban',
          confidence: 'medium',
          reason: `PIN ${pin} matches a known urban area`,
        };
      }
    }
  }

  // Heuristic: if last 3 digits are 001 (GPO) or very low, likely urban
  if (lastThree <= 5) {
    return {
      type: 'urban',
      confidence: 'medium',
      reason: 'PIN ends in low digits — likely a district headquarters or city area',
    };
  }

  // Default: can't determine
  return {
    type: 'unknown',
    confidence: 'low',
    reason: 'Could not determine — please select manually',
  };
}

/**
 * Map from the first digit of PIN code to Indian postal zone / broad region.
 */
export function getPinRegion(pincode: string): string {
  const zones: Record<string, string> = {
    '1': 'Delhi, Haryana, Punjab, HP, J&K',
    '2': 'Uttar Pradesh, Uttarakhand',
    '3': 'Rajasthan, Gujarat',
    '4': 'Maharashtra, Goa, MP, Chhattisgarh',
    '5': 'Andhra Pradesh, Telangana, Karnataka',
    '6': 'Tamil Nadu, Kerala',
    '7': 'West Bengal, Odisha, NE States',
    '8': 'Bihar, Jharkhand',
  };
  return zones[pincode[0]] || 'Unknown region';
}
