export type StampRates = {
  male: number;
  female: number;
  joint: number;
  registrationFee: number;
  maxRegistrationFee?: number;
  notes: string;
};

export const stampRates: Record<string, { residential: StampRates; commercial: StampRates }> = {
  'Maharashtra': {
    residential: {
      male: 6, female: 5, joint: 6, registrationFee: 1,
      maxRegistrationFee: 30000,
      notes: 'Metro cess of 1% applies in Mumbai. LBT may apply.',
    },
    commercial: {
      male: 6, female: 6, joint: 6, registrationFee: 1,
      maxRegistrationFee: 30000,
      notes: 'Same rates as residential for commercial.',
    },
  },
  'Karnataka': {
    residential: {
      male: 5.6, female: 5.6, joint: 5.6, registrationFee: 1,
      notes: 'Includes 0.5% cess and 10% surcharge on stamp duty. BBMP properties may have additional charges.',
    },
    commercial: {
      male: 5.6, female: 5.6, joint: 5.6, registrationFee: 1,
      notes: 'Same as residential.',
    },
  },
  'Delhi': {
    residential: {
      male: 6, female: 4, joint: 5, registrationFee: 1,
      maxRegistrationFee: 50000,
      notes: 'Women buyers get 2% concession. North Delhi, South Delhi, East Delhi registrars differ slightly.',
    },
    commercial: {
      male: 6, female: 6, joint: 6, registrationFee: 1,
      maxRegistrationFee: 50000,
      notes: 'No concession for commercial.',
    },
  },
  'Uttar Pradesh': {
    residential: {
      male: 7, female: 6, joint: 7, registrationFee: 1,
      maxRegistrationFee: 20000,
      notes: 'UP charges 7% stamp duty. Women buyers get 1% rebate.',
    },
    commercial: {
      male: 7, female: 7, joint: 7, registrationFee: 1,
      maxRegistrationFee: 20000,
      notes: 'Same as residential, no gender concession.',
    },
  },
  'Tamil Nadu': {
    residential: {
      male: 7, female: 7, joint: 7, registrationFee: 4,
      notes: 'TN has 4% registration fee — one of the highest. Stamp duty is 7%.',
    },
    commercial: {
      male: 7, female: 7, joint: 7, registrationFee: 4,
      notes: 'Same rates apply to commercial properties.',
    },
  },
  'Gujarat': {
    residential: {
      male: 4.9, female: 4.9, joint: 4.9, registrationFee: 1,
      notes: 'Includes 1% local body tax. Lower than most states.',
    },
    commercial: {
      male: 4.9, female: 4.9, joint: 4.9, registrationFee: 1,
      notes: 'Same as residential.',
    },
  },
  'Rajasthan': {
    residential: {
      male: 6, female: 5, joint: 6, registrationFee: 1,
      notes: 'Women buyers get 1% concession on stamp duty.',
    },
    commercial: {
      male: 6, female: 6, joint: 6, registrationFee: 1,
      notes: 'No concession for commercial.',
    },
  },
  'West Bengal': {
    residential: {
      male: 6, female: 6, joint: 6, registrationFee: 1,
      notes: 'Kolkata Municipal Corporation properties have an additional 2% surcharge.',
    },
    commercial: {
      male: 7, female: 7, joint: 7, registrationFee: 1,
      notes: 'Commercial stamp duty is 7% in WB.',
    },
  },
  'Telangana': {
    residential: {
      male: 5, female: 5, joint: 5, registrationFee: 0.5,
      notes: 'Transfer duty of 1.5% also applies. Total effective rate ~7%.',
    },
    commercial: {
      male: 5, female: 5, joint: 5, registrationFee: 0.5,
      notes: 'Same effective rate as residential.',
    },
  },
  'Haryana': {
    residential: {
      male: 7, female: 5, joint: 7, registrationFee: 1,
      maxRegistrationFee: 50000,
      notes: 'Women buyers get 2% concession. Urban vs rural rates differ.',
    },
    commercial: {
      male: 7, female: 7, joint: 7, registrationFee: 1,
      maxRegistrationFee: 50000,
      notes: 'No gender concession for commercial.',
    },
  },
};
