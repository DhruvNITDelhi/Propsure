// ─── Legacy export (unchanged for backward compat) ───
export const landPortals: Record<string, { name: string; url: string; searchBy: string }> = {
  'Uttar Pradesh': { name: 'Bhulekh UP', url: 'https://upbhulekh.gov.in', searchBy: 'Khasra/Gata number, owner name' },
  'Maharashtra': { name: 'Mahabhulekh', url: 'https://bhulekh.mahabhumi.gov.in', searchBy: 'Survey number, CTS number' },
  'Karnataka': { name: 'Bhoomi', url: 'https://bhoomi.karnataka.gov.in', searchBy: 'Survey number, owner name' },
  'Rajasthan': { name: 'Apna Khata', url: 'https://apnakhata.rajasthan.gov.in', searchBy: 'Khasra number, khata number' },
  'Madhya Pradesh': { name: 'MP Bhulekh', url: 'https://mpbhulekh.gov.in', searchBy: 'Khasra number, bhuswami name' },
  'Bihar': { name: 'Bihar Bhumi', url: 'https://biharbhumi.bihar.gov.in', searchBy: 'Khata, khasra number' },
  'Haryana': { name: 'Jamabandi Haryana', url: 'https://jamabandi.nic.in', searchBy: 'Khasra, khewat number' },
  'Punjab': { name: 'Punjab Land Records', url: 'https://plrs.org.in', searchBy: 'Khasra, khewat number' },
  'Gujarat': { name: 'AnyROR Gujarat', url: 'https://anyror.gujarat.gov.in', searchBy: 'Survey number, owner name' },
  'Tamil Nadu': { name: 'TNEVIS / Patta Chitta', url: 'https://eservices.tn.gov.in', searchBy: 'Survey number, patta number' },
  'Telangana': { name: 'Dharani', url: 'https://dharani.telangana.gov.in', searchBy: 'Survey number, document number' },
  'Kerala': { name: 'E-Rekha Kerala', url: 'https://erekha.kerala.gov.in', searchBy: 'Survey number, village' },
  'West Bengal': { name: 'Banglarbhumi', url: 'https://banglarbhumi.gov.in', searchBy: 'Khatian, plot number' },
  'Odisha': { name: 'Bhulekh Odisha', url: 'https://bhulekh.ori.nic.in', searchBy: 'Plot number, RoR number' },
  'Delhi': { name: 'Delhi Land Records', url: 'https://dlrc.delhi.gov.in', searchBy: 'Khasra number, owner name' },
  'Himachal Pradesh': { name: 'Himbhoomi', url: 'https://ehimbhoomi.nic.in', searchBy: 'Khasra, khewat number' },
  'Uttarakhand': { name: 'Bhulekh Uttarakhand', url: 'https://bhulekh.uk.gov.in', searchBy: 'Khasra number, khatauni' },
  'Chhattisgarh': { name: 'Bhuiyan', url: 'https://bhuiyan.cg.nic.in', searchBy: 'Patwari halka, survey number' },
  'Jharkhand': { name: 'Jharbhoomi', url: 'https://jharbhoomi.jharkhand.gov.in', searchBy: 'Khasra, khata number' },
  'Assam': { name: 'Dharitree', url: 'https://revenueassam.nic.in', searchBy: 'Dag number, patta number' },
  'Andhra Pradesh': { name: 'MeeBhoomi', url: 'https://meebhoomi.ap.gov.in', searchBy: 'Adangal, 1-B, Survey number' },
  'Goa': { name: 'DSLR Goa', url: 'https://dslr.goa.gov.in', searchBy: 'Form I & XIV, Survey number' },
  'Tripura': { name: 'Jami Tripura', url: 'https://jami.tripura.gov.in', searchBy: 'Khatian, Plot number' },
};

// ─── NEW: Extended portal data for the Smart Property Finder ───

export type PortalInfo = {
  name: string;
  url: string;
  searchBy: string;
};

export type StatePortalData = {
  rural: {
    landRecord: PortalInfo;
    bhuNaksha?: PortalInfo;    // Visual cadastral map
  };
  urban: {
    registration: PortalInfo;  // Stamp & registration (deed search)
    municipal?: PortalInfo;    // Nagar Palika / Nigam
    encumbrance?: PortalInfo;  // EC certificate
  };
  /** Tips shown when user has NO documents at all */
  noDocsTips: string[];
};

export const statePortals: Record<string, StatePortalData> = {
  'Uttar Pradesh': {
    rural: {
      landRecord: {
        name: 'Bhulekh UP',
        url: 'https://upbhulekh.gov.in',
        searchBy: 'District → Tehsil → Village → Gata/Khasra Number or Owner Name',
      },
      bhuNaksha: {
        name: 'UP BhuNaksha',
        url: 'https://upbhunaksha.gov.in',
        searchBy: 'District → Tehsil → Village → Click on plot visually',
      },
    },
    urban: {
      registration: {
        name: 'IGRSUP (Stamp & Registration)',
        url: 'https://igrsup.gov.in',
        searchBy: 'District → SRO Office → Year → Party Name (buyer/seller)',
      },
      municipal: {
        name: 'e-Nagar Sewa UP',
        url: 'https://e-nagarsewaup.gov.in',
        searchBy: 'City → Ward → Property ID or Owner Name',
      },
    },
    noDocsTips: [
      'Visit IGRSUP and search by your name or the seller\'s name in "Sampatti Vivaran" (Property Details) section',
      'Go to your local Nagar Palika office with an ID proof — ask for your House Tax Number',
      'Check old electricity or water bills — they sometimes mention a property ID or survey number',
      'Visit the Sub-Registrar Office (SRO) in Lakhimpur with an ID proof to get copies of any registered deeds in your name',
    ],
  },
  'Maharashtra': {
    rural: {
      landRecord: {
        name: 'Mahabhulekh',
        url: 'https://bhulekh.mahabhumi.gov.in',
        searchBy: 'District → Taluka → Village → Survey/Gat Number',
      },
      bhuNaksha: {
        name: 'Maharashtra BhuNaksha',
        url: 'https://mahabhunakasha.mahabhumi.gov.in',
        searchBy: 'District → Taluka → Village → Click on plot',
      },
    },
    urban: {
      registration: {
        name: 'IGR Maharashtra',
        url: 'https://igrmaharashtra.gov.in',
        searchBy: 'District → SRO → Year → Document Number or Party Name',
      },
      municipal: {
        name: 'Municipal Property Tax',
        url: 'https://citizen.mahaonline.gov.in',
        searchBy: 'City → Property Tax ID or Owner Name',
      },
    },
    noDocsTips: [
      'On IGR Maharashtra, use "Index-II" search — you can find registered deeds by searching the buyer or seller name',
      'Visit your nearest municipal corporation with ID proof to get your property tax number',
      'Check your electricity bill — MSEDCL bills sometimes mention the survey/CTS number',
    ],
  },
  'Karnataka': {
    rural: {
      landRecord: {
        name: 'Bhoomi',
        url: 'https://bhoomi.karnataka.gov.in',
        searchBy: 'District → Taluk → Hobli → Village → Survey Number or Owner Name',
      },
      bhuNaksha: {
        name: 'Dishaank (Bhu Naksha)',
        url: 'https://www.dishaank.karnataka.gov.in',
        searchBy: 'District → Taluk → Village → Click on plot',
      },
    },
    urban: {
      registration: {
        name: 'Kaveri Online (Registration)',
        url: 'https://kaverionline.karnataka.gov.in',
        searchBy: 'District → SRO → Year → Document Number',
      },
      municipal: {
        name: 'BBMP / Municipality Portal',
        url: 'https://bbmptax.karnataka.gov.in',
        searchBy: 'Property ID (PID) or SAS Application Number',
      },
    },
    noDocsTips: [
      'On Bhoomi, you can search by owner name — no survey number needed',
      'For Bangalore properties, search on BBMP Sakala with your name',
      'Visit the local Sub-Registrar Office with Aadhaar to trace any registered deeds',
    ],
  },
  'Rajasthan': {
    rural: {
      landRecord: {
        name: 'Apna Khata',
        url: 'https://apnakhata.rajasthan.gov.in',
        searchBy: 'District → Tehsil → Village → Click area on visual map',
      },
      bhuNaksha: {
        name: 'Rajasthan BhuNaksha',
        url: 'https://bhunaksha.rajasthan.gov.in',
        searchBy: 'District → Tehsil → Village → Click on plot',
      },
    },
    urban: {
      registration: {
        name: 'e-Registration Rajasthan',
        url: 'https://pnrd.rajasthan.gov.in',
        searchBy: 'District → SRO → Party Name or Document Number',
      },
      municipal: {
        name: 'Rajasthan UDH',
        url: 'https://urban.rajasthan.gov.in',
        searchBy: 'City → Ward → Property ID',
      },
    },
    noDocsTips: [
      'Apna Khata has a visual map — click your area to find the khasra number without needing any document',
      'Visit the Nagar Palika with your Aadhaar card to get your property tax record',
    ],
  },
  'Madhya Pradesh': {
    rural: {
      landRecord: {
        name: 'MP Bhulekh',
        url: 'https://mpbhulekh.gov.in',
        searchBy: 'District → Tehsil → Village → Khasra Number or Bhuswami Name',
      },
      bhuNaksha: {
        name: 'MP BhuNaksha',
        url: 'https://mpbhunaksha.nic.in',
        searchBy: 'District → Tehsil → Village → Click on plot',
      },
    },
    urban: {
      registration: {
        name: 'MPIGR (Registration)',
        url: 'https://www.mpigr.gov.in',
        searchBy: 'District → SRO → Year → Party Name',
      },
    },
    noDocsTips: [
      'MP Bhulekh allows search by bhuswami (owner) name — try searching your name',
      'Visit your local Tehsil office with ID proof to get a certified copy of your land record',
    ],
  },
  'Bihar': {
    rural: {
      landRecord: {
        name: 'Bihar Bhumi',
        url: 'https://biharbhumi.bihar.gov.in',
        searchBy: 'District → Sub-Division → Circle → Mauja → Khata or Owner Name',
      },
      bhuNaksha: {
        name: 'Bihar BhuNaksha',
        url: 'https://bhunaksha.bihar.gov.in',
        searchBy: 'District → Sub-Division → Circle → Mauja → Click on plot',
      },
    },
    urban: {
      registration: {
        name: 'Bihar Registration (BRIS)',
        url: 'https://registration.bihar.gov.in',
        searchBy: 'District → SRO → Year → Party Name or Deed Number',
      },
    },
    noDocsTips: [
      'Bihar Bhumi lets you search by owner name — select your District, Block, and Mauja, then enter your name',
      'Visit the local Anchal office for land records or the SRO for registered deeds',
    ],
  },
  'Haryana': {
    rural: {
      landRecord: {
        name: 'Jamabandi Haryana',
        url: 'https://jamabandi.nic.in',
        searchBy: 'District → Tehsil → Village → Owner Name or Khewat/Khasra',
      },
    },
    urban: {
      registration: {
        name: 'Haryana Registration',
        url: 'https://jamabandi.nic.in',
        searchBy: 'District → Tehsil → Village → Owner Name',
      },
    },
    noDocsTips: [
      'On Jamabandi, you can search by owner name directly',
      'Visit your Municipal Committee office with ID proof for urban property records',
    ],
  },
  'Punjab': {
    rural: {
      landRecord: {
        name: 'Punjab Land Records (PLRS)',
        url: 'https://plrs.org.in',
        searchBy: 'District → Tehsil → Village → Khasra or Khewat Number',
      },
    },
    urban: {
      registration: {
        name: 'Punjab Registration',
        url: 'https://plrs.org.in',
        searchBy: 'District → Tehsil → Village → Owner Name',
      },
    },
    noDocsTips: [
      'PLRS supports searching by owner name in most districts',
      'Visit your local Patwari or Tehsildar office with Aadhaar to trace your records',
    ],
  },
  'Gujarat': {
    rural: {
      landRecord: {
        name: 'AnyROR Gujarat',
        url: 'https://anyror.gujarat.gov.in',
        searchBy: 'District → Taluka → Village → Survey Number or Owner Name',
      },
    },
    urban: {
      registration: {
        name: 'e-Dhara Gujarat',
        url: 'https://anyror.gujarat.gov.in',
        searchBy: 'District → Taluka → Village → Survey Number or Owner Name',
      },
    },
    noDocsTips: [
      'AnyROR lets you search by owner name — select district, taluka, village and search',
      'For city properties, check your municipal corporation portal for property tax records',
    ],
  },
  'Tamil Nadu': {
    rural: {
      landRecord: {
        name: 'Patta Chitta',
        url: 'https://eservices.tn.gov.in',
        searchBy: 'District → Taluk → Village → Survey Number or Patta Number',
      },
    },
    urban: {
      registration: {
        name: 'TNREGINET',
        url: 'https://tnreginet.gov.in',
        searchBy: 'District → SRO → Year → Document Number or Party Name',
      },
      municipal: {
        name: 'TUFIDCO Urban',
        url: 'https://tufidco.in',
        searchBy: 'Corporation → Zone → Property Tax Number',
      },
    },
    noDocsTips: [
      'TNREGINET allows encumbrance certificate search by owner name',
      'Visit your local Taluk Office with ID proof for patta details',
    ],
  },
  'Telangana': {
    rural: {
      landRecord: {
        name: 'Dharani',
        url: 'https://dharani.telangana.gov.in',
        searchBy: 'District → Mandal → Village → Survey Number or Pattadar Name',
      },
    },
    urban: {
      registration: {
        name: 'CARD Registration',
        url: 'https://registration.telangana.gov.in',
        searchBy: 'District → SRO → Year → Document Number',
      },
      municipal: {
        name: 'CDMA / GHMC',
        url: 'https://onlinepayment.ghmc.gov.in',
        searchBy: 'PTIN (Property Tax ID Number)',
      },
    },
    noDocsTips: [
      'Dharani allows search by pattadar (owner) name',
      'For Hyderabad, visit GHMC citizen center with ID proof to get your PTIN',
    ],
  },
  'West Bengal': {
    rural: {
      landRecord: {
        name: 'Banglarbhumi',
        url: 'https://banglarbhumi.gov.in',
        searchBy: 'District → Block → Mouza → Plot Number or Khatian Number',
      },
    },
    urban: {
      registration: {
        name: 'WB Registration (e-NRIPC)',
        url: 'https://wbregistration.gov.in',
        searchBy: 'District → SRO → Year → Deed Number or Party Name',
      },
      municipal: {
        name: 'KMC / Municipality',
        url: 'https://www.kmcgov.in',
        searchBy: 'Assessment Number or Owner Name',
      },
    },
    noDocsTips: [
      'On Banglarbhumi, try searching by owner name in your mouza',
      'For Kolkata, visit KMC assessment department with ID proof',
    ],
  },
  'Delhi': {
    rural: {
      landRecord: {
        name: 'Delhi Land Records',
        url: 'https://dlrc.delhi.gov.in',
        searchBy: 'Village → Khasra Number or Owner Name',
      },
    },
    urban: {
      registration: {
        name: 'DORIS (Delhi Registration)',
        url: 'https://doris.delhi.gov.in',
        searchBy: 'SRO → Year → Document Number or Party Name',
      },
      municipal: {
        name: 'MCD Property Tax',
        url: 'https://mcdonline.nic.in',
        searchBy: 'Property ID (UPIC) or Colony Name',
      },
    },
    noDocsTips: [
      'DORIS lets you search registered deeds by buyer/seller name',
      'Visit your local MCD office to get your UPIC (property tax ID)',
      'Check old electricity bills from BSES/TPDDL — they sometimes mention the property ID',
    ],
  },
};

// Helper: get portal data for a state, falling back to legacy data
export function getStatePortalData(state: string): StatePortalData | null {
  if (statePortals[state]) return statePortals[state];

  // Fallback: wrap legacy data into the new structure
  const legacy = landPortals[state];
  if (legacy) {
    return {
      rural: {
        landRecord: { name: legacy.name, url: legacy.url, searchBy: legacy.searchBy },
      },
      urban: {
        registration: { name: `${state} Registration`, url: legacy.url, searchBy: legacy.searchBy },
      },
      noDocsTips: [
        `Visit your local Tehsil or Sub-Registrar office with an ID proof (Aadhaar) to trace records in your name`,
        `Ask at your local municipal office for a house tax number or property ID`,
      ],
    };
  }

  return null;
}
