export type MutationGuide = {
  localName: string;
  department: string;
  timeline: string;
  feeRange: string;
  onlinePortal?: string;
  documents: string[];
  steps: { title: string; detail: string }[];
  rejectionTips: string[];
};

export const mutationGuides: Record<string, MutationGuide> = {
  'Maharashtra': {
    localName: 'Ferfar / Property Card Transfer',
    department: 'City Survey Office (CSO) for urban / Tehsildar for rural',
    timeline: '30–90 days',
    feeRange: '₹200–₹1000',
    onlinePortal: 'https://mahabhumi.gov.in',
    documents: [
      'Registered sale deed (original + photocopy)',
      'Index II of the sale deed',
      'Latest property tax receipt',
      'Aadhaar card of buyer',
      '7/12 extract (for agricultural land)',
      'Form 6 application (available at Tehsil office)',
      'Court fee stamp',
    ],
    steps: [
      {
        title: 'Get Index II',
        detail: 'Obtain Index II from the Sub-Registrar Office where your sale deed was registered. This is a summary of the registered document.',
      },
      {
        title: 'Visit Tehsildar / City Survey Office',
        detail: 'Go to the Tehsildar office (rural) or City Survey Office (urban) in the district where the property is located.',
      },
      {
        title: 'Submit Form 6',
        detail: 'Fill Form 6 (mutation application). Attach all documents. Pay the court fee stamp (₹200–₹500 depending on district).',
      },
      {
        title: 'Notice period',
        detail: 'A public notice is issued. Any objections must be filed within 15–30 days.',
      },
      {
        title: 'Verification',
        detail: 'The Tehsildar or CRO officer visits or verifies documents.',
      },
      {
        title: 'Mutation order',
        detail: 'Mutation order is issued and records are updated in 7/12 (Satbara) for rural or Property Card for urban.',
      },
    ],
    rejectionTips: [
      'Always attach Index II — this is the most common reason for rejection',
      'Ensure the sale deed is registered, not just notarized',
      'Check that the property tax is paid up to date before applying',
      'For agricultural land, verify that the seller has no outstanding bank liens on the property',
    ],
  },
  'Uttar Pradesh': {
    localName: 'Dakhil Kharij',
    department: 'Lekhpal / Tehsildar office',
    timeline: '15–45 days',
    feeRange: '₹0 (no official fee) — avoid paying unofficial charges',
    onlinePortal: 'https://vaad.up.nic.in',
    documents: [
      'Registered sale deed (photocopy)',
      'Aadhaar card of buyer and seller',
      'Latest property tax receipt',
      'Application form (Form-2)',
      'Court fee stamp (₹10–₹50)',
    ],
    steps: [
      {
        title: 'File application at Lekhpal',
        detail: 'Visit your local Lekhpal (village-level revenue official) with all documents. Submit Form-2 mutation application.',
      },
      {
        title: 'Lekhpal verification',
        detail: 'Lekhpal visits the site and verifies possession. This typically takes 7–15 days.',
      },
      {
        title: 'Tehsildar approval',
        detail: 'File is forwarded to Tehsildar. If no objection is received within 15 days, Tehsildar approves.',
      },
      {
        title: 'Khatauni updated',
        detail: 'Your name is entered in the Khatauni (record of rights). Download from Bhulekh UP portal.',
      },
    ],
    rejectionTips: [
      'Do not pay unofficial bribes — use the CM Helpline 1076 to report demands',
      'Ensure the sale deed mentions the full property boundary (chauhadi)',
      'If the land was acquired by inheritance, you must submit a family tree (vanshavali) attested by the Gram Pradhan',
      'Check that the seller\'s name in the sale deed matches exactly with the Khatauni',
    ],
  },
  'Karnataka': {
    localName: 'Khata Transfer',
    department: 'BBMP (Bengaluru) / City Municipal Council / Gram Panchayat',
    timeline: '30–60 days',
    feeRange: '₹500–₹3000 (depending on property value)',
    onlinePortal: 'https://bbmptax.karnataka.gov.in',
    documents: [
      'Registered sale deed (original + copy)',
      'Previous owner\'s Khata certificate and extract',
      'Latest property tax payment receipt',
      'Encumbrance certificate (last 15 years)',
      'Aadhaar card of buyer',
      'Application form (from BBMP/CMC office)',
      'Betterment charges receipt (if applicable)',
    ],
    steps: [
      {
        title: 'Collect EC',
        detail: 'Get Encumbrance Certificate (EC) for last 15 years from the Sub-Registrar Office. Confirms no pending loans or disputes.',
      },
      {
        title: 'Pay betterment charges',
        detail: 'BBMP levies betterment charges on properties in converted areas. Pay if applicable.',
      },
      {
        title: 'Submit application to BBMP ARO',
        detail: 'Go to the BBMP Assistant Revenue Officer (ARO) for your ward. Submit application with all documents.',
      },
      {
        title: 'Site inspection',
        detail: 'An inspector verifies the property and occupancy.',
      },
      {
        title: 'Khata issued',
        detail: 'A, B, or E Khata is issued in the new owner\'s name. A-Khata means property is regularized. B-Khata means irregularities exist.',
      },
    ],
    rejectionTips: [
      'Always get an A-Khata — a B-Khata property cannot get building permits',
      'EC must be for minimum 15 years — 13 years is not accepted',
      'If you receive a demand for informal payments, file a complaint at the BBMP PRO office or call 080-22660000',
      'If the previous owner has outstanding property tax, you may be asked to pay arrears — verify this before purchase',
    ],
  },
  'Delhi': {
    localName: 'Mutation of Property',
    department: 'MCD (municipal areas) / DDA / Revenue Department (rural/lal dora)',
    timeline: '30–60 days',
    feeRange: '₹200–₹1000',
    documents: [
      'Registered sale deed (copy)',
      'Proof of payment of stamp duty and registration fee',
      'Identity proof (Aadhaar)',
      'Latest property tax receipt',
      'Application form',
      'Affidavit on stamp paper',
    ],
    steps: [
      {
        title: 'Apply to MCD zonal office',
        detail: 'Visit the MCD zone office for your area. For DDA flats, apply to the DDA zone office.',
      },
      {
        title: 'Document verification',
        detail: 'Documents are verified by the Revenue Inspector.',
      },
      {
        title: 'Inspection if required',
        detail: 'Physical inspection of property may be conducted.',
      },
      {
        title: 'Mutation entry',
        detail: 'Name is updated in municipal records within 30–60 days.',
      },
    ],
    rejectionTips: [
      'For DDA flats, check if the original allottee had a no-dues certificate before buying',
      'Lal Dora properties have a different process — consult a local patwari',
      'Ensure property tax is fully paid — pending arrears will block mutation',
      'Keep all original documents — photocopies alone are not accepted at the MCD',
    ],
  },
  'Tamil Nadu': {
    localName: 'Patta Transfer',
    department: 'Taluk office (Tahsildar)',
    timeline: '15–30 days',
    feeRange: '₹100–₹500',
    onlinePortal: 'https://eservices.tn.gov.in',
    documents: [
      'Registered sale deed (copy)',
      'Previous patta (in seller\'s name)',
      'Latest land tax (kist) receipt',
      'Aadhaar card of buyer',
      'Application form (Form 1A)',
    ],
    steps: [
      {
        title: 'Apply online or at Taluk office',
        detail: 'Submit Form 1A online at eservices.tn.gov.in or physically at the Taluk office.',
      },
      {
        title: 'Verification by VAO',
        detail: 'Village Administrative Officer (VAO) verifies documents and conducts field inspection.',
      },
      {
        title: 'Tahsildar approval',
        detail: 'Tahsildar approves the mutation and orders patta transfer.',
      },
      {
        title: 'New patta issued',
        detail: 'New patta is issued in buyer\'s name. Download from eservices.tn.gov.in.',
      },
    ],
    rejectionTips: [
      'Ensure the survey number in the sale deed matches the patta exactly',
      'For agricultural land with FMB (field measurement book) disputes, a revenue survey may be needed first',
      'Check that no court stay order exists on the property — search at the District Court registry',
      'Online patta transfer is faster — use eservices.tn.gov.in whenever possible',
    ],
  },
  'Gujarat': {
    localName: 'Property Mutation / Namjamin',
    department: 'Mamlatdar / Talati office',
    timeline: '15–60 days',
    feeRange: '₹100–₹500',
    onlinePortal: 'https://anyror.gujarat.gov.in',
    documents: [
      'Registered sale deed (original + photocopy)',
      'Form No. 6 (mutation application)',
      'Property card / city survey extract',
      'Latest NA permission (for agricultural-to-non-agricultural conversion)',
      'Aadhaar card of buyer',
      'Latest property tax receipt',
    ],
    steps: [
      {
        title: 'Submit Form No. 6',
        detail: 'Visit the Mamlatdar (Collector) office or Talati (village level) office. Submit Form No. 6 with all documents.',
      },
      {
        title: 'Public notice',
        detail: 'A public notice is published. Objections can be filed within 30 days.',
      },
      {
        title: 'Verification by Talati',
        detail: 'The Talati verifies documents and conducts a field visit.',
      },
      {
        title: 'Mutation order',
        detail: 'Mamlatdar issues the mutation order. Records are updated in the village form (7/12 for rural, property card for urban).',
      },
    ],
    rejectionTips: [
      'Ensure NA (Non-Agricultural) permission is obtained before mutating agricultural land for residential use',
      'The AnyROR portal allows checking current ownership — verify before applying',
      'For properties in SEZ or industrial zones, additional clearances may be needed',
      'Keep a copy of the published notice as proof of the mutation process',
    ],
  },
  'Rajasthan': {
    localName: 'Dakhil Kharij / Namantaran',
    department: 'Patwari / Tehsildar office',
    timeline: '15–45 days',
    feeRange: '₹100–₹500',
    onlinePortal: 'https://apnakhata.raj.nic.in',
    documents: [
      'Registered sale deed (original + photocopy)',
      'Jamabandi (copy of existing land record)',
      'Aadhaar card of buyer',
      'Latest revenue receipt (kist receipt)',
      'Application form for mutation',
      'Affidavit (if required)',
    ],
    steps: [
      {
        title: 'Visit Patwari office',
        detail: 'Submit mutation application to the local Patwari with all required documents.',
      },
      {
        title: 'Patwari verification',
        detail: 'The Patwari verifies documents and conducts a site inspection. This usually takes 10–15 days.',
      },
      {
        title: 'Tehsildar hearing',
        detail: 'If no objections, the case is forwarded to the Tehsildar for approval.',
      },
      {
        title: 'Mutation entry',
        detail: 'Mutation is recorded in the Jamabandi. The new owner can verify on Apna Khata portal.',
      },
    ],
    rejectionTips: [
      'Ensure the Jamabandi is current — old records may have discrepancies',
      'In joint Hindu family property cases, all legal heirs must consent',
      'Agricultural land mutation requires caste verification in tribal areas',
      'Use the Apna Khata portal to verify the mutation status periodically',
    ],
  },
  'West Bengal': {
    localName: 'Mutation / Namjari',
    department: 'Block Land & Land Reforms Office (BL&LRO)',
    timeline: '30–90 days',
    feeRange: '₹300–₹2000',
    onlinePortal: 'https://banglarbhumi.gov.in',
    documents: [
      'Registered deed of conveyance (original + photocopy)',
      'Latest land & land revenue receipt',
      "Application form (Form 'L')",
      'Aadhaar card of buyer',
      'Khatian (record of rights) copy',
      'Plot map from Mouza map',
      'Mutation fee challan',
    ],
    steps: [
      {
        title: 'Apply at BL&LRO',
        detail: 'Submit Form L (mutation application) at the Block Land & Land Reforms Office with all documents.',
      },
      {
        title: 'Notice publication',
        detail: 'A notice is published for objections. The objection period is usually 15–30 days.',
      },
      {
        title: 'Field verification',
        detail: 'A Revenue Inspector visits the property and verifies physical possession.',
      },
      {
        title: 'Mutation recorded',
        detail: 'BL&LRO officer records the mutation. Updated Khatian is generated and available on Banglarbhumi portal.',
      },
    ],
    rejectionTips: [
      'In Kolkata, apply at the KMC (Kolkata Municipal Corporation) instead of BL&LRO',
      'The Khatian must be up-to-date — apply for a certified copy if the old one is disputed',
      'For properties under Thika Tenancy Act, additional court orders may be needed',
      'Joint ownership changes require all co-owners to sign a consent affidavit',
    ],
  },
  'Haryana': {
    localName: 'Intqaal (Mutation)',
    department: 'Patwari / Tehsildar office',
    timeline: '30–60 days',
    feeRange: '₹100–₹1000',
    onlinePortal: 'https://jamabandi.nic.in',
    documents: [
      'Registered sale deed (original + photocopy)',
      'Jamabandi copy (existing land record)',
      'Aadhaar card of buyer and seller',
      'Latest revenue/kist receipt',
      'Application for Intqaal',
      'Court fee stamp',
      'NOC from competent authority (for agricultural land in restricted zones)',
    ],
    steps: [
      {
        title: 'Submit Intqaal application',
        detail: 'Submit mutation (Intqaal) application at the Patwari/Kanungo office with all required documents.',
      },
      {
        title: 'Public notice',
        detail: 'A public notice (munadi) is issued. Objections can be filed within 15 days.',
      },
      {
        title: 'Verification by Patwari',
        detail: 'Patwari verifies documents and physical possession.',
      },
      {
        title: 'Tehsildar order',
        detail: 'Tehsildar approves and orders the Intqaal. Jamabandi is updated with new owner details.',
      },
    ],
    rejectionTips: [
      'In Gurugram and Faridabad, mutation is faster through HARERA-registered properties',
      'Agricultural land near urban areas may need Section 118 permission (Punjab Land Reforms Act)',
      'Verify the khewat/khatauni numbers match exactly between deed and Jamabandi',
      'Use the Jamabandi portal to check mutation status — avoid unnecessary visits',
    ],
  },
  'Telangana': {
    localName: 'Mutation / Title Update',
    department: 'Mee Seva / Tahsildar office / Dharani portal',
    timeline: '15–30 days',
    feeRange: '₹100–₹500',
    onlinePortal: 'https://dharani.telangana.gov.in',
    documents: [
      'Registered sale deed (copy)',
      'Previous passbook (Pahani) in seller\'s name',
      'Aadhaar card of buyer',
      'Latest property tax receipt',
      'Slot booking from Dharani portal',
      'Form for mutation (available on Dharani)',
    ],
    steps: [
      {
        title: 'Book slot on Dharani',
        detail: 'Visit dharani.telangana.gov.in and book a slot for mutation. Choose the nearest MRO (Mandal Revenue Office).',
      },
      {
        title: 'Visit MRO office',
        detail: 'On the scheduled date, visit the MRO with all original documents.',
      },
      {
        title: 'Biometric verification',
        detail: 'Both buyer and seller need to complete Aadhaar-based biometric verification at the office.',
      },
      {
        title: 'Passbook update',
        detail: 'The Pahani (passbook) is updated online through Dharani. New passbook is generated in buyer\'s name.',
      },
    ],
    rejectionTips: [
      'Dharani is mandatory — offline-only applications are no longer accepted for most areas',
      'Ensure both parties (buyer and seller) attend the MRO office together for biometric verification',
      'If the property is in HMDA (Hyderabad Metropolitan Dev. Authority) area, additional approvals may apply',
      'Check for pending revenue court cases on the property using Dharani portal before purchase',
    ],
  },
};
