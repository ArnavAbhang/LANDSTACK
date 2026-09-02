export interface LocationOption {
  id: string;
  name: string;
  code?: string;
  stateId?: string;
  districtId?: string;
  talukaId?: string;
  lgdCode?: string;
}

export const STATES_DATA: LocationOption[] = [
  { id: 'ST_MH', name: 'Maharashtra', code: 'MH' },
  { id: 'ST_TN', name: 'Tamil Nadu', code: 'TN' },
  { id: 'ST_PB', name: 'Punjab', code: 'PB' },
  { id: 'ST_KA', name: 'Karnataka', code: 'KA' },
  { id: 'ST_GJ', name: 'Gujarat', code: 'GJ' },
];

export const DISTRICTS_BY_STATE: Record<string, LocationOption[]> = {
  ST_MH: [
    { id: 'DIST_PUNE', name: 'Pune', code: 'PUN', stateId: 'ST_MH' },
    { id: 'DIST_THANE', name: 'Thane', code: 'THN', stateId: 'ST_MH' },
    { id: 'DIST_NAGPUR', name: 'Nagpur', code: 'NGP', stateId: 'ST_MH' },
    { id: 'DIST_NASHIK', name: 'Nashik', code: 'NSK', stateId: 'ST_MH' },
    { id: 'DIST_MUMBAI', name: 'Mumbai Suburban', code: 'MUM', stateId: 'ST_MH' },
  ],
  ST_TN: [
    { id: 'DIST_KANCHI', name: 'Kanchipuram', code: 'KCH', stateId: 'ST_TN' },
    { id: 'DIST_CHNAI', name: 'Chennai', code: 'MAA', stateId: 'ST_TN' },
    { id: 'DIST_COIMB', name: 'Coimbatore', code: 'CBE', stateId: 'ST_TN' },
    { id: 'DIST_MADUR', name: 'Madurai', code: 'MDU', stateId: 'ST_TN' },
  ],
  ST_PB: [
    { id: 'DIST_SAS', name: 'SAS Nagar (Mohali)', code: 'MHL', stateId: 'ST_PB' },
    { id: 'DIST_LUDH', name: 'Ludhiana', code: 'LDH', stateId: 'ST_PB' },
    { id: 'DIST_AMRIT', name: 'Amritsar', code: 'ASR', stateId: 'ST_PB' },
    { id: 'DIST_JALAN', name: 'Jalandhar', code: 'JAL', stateId: 'ST_PB' },
  ],
  ST_KA: [
    { id: 'DIST_BLR', name: 'Bengaluru Urban', code: 'BLR', stateId: 'ST_KA' },
    { id: 'DIST_MYS', name: 'Mysuru', code: 'MYS', stateId: 'ST_KA' },
    { id: 'DIST_MNG', name: 'Mangaluru', code: 'IXE', stateId: 'ST_KA' },
  ],
  ST_GJ: [
    { id: 'DIST_AMD', name: 'Ahmedabad', code: 'AMD', stateId: 'ST_GJ' },
    { id: 'DIST_SURAT', name: 'Surat', code: 'STV', stateId: 'ST_GJ' },
    { id: 'DIST_VADO', name: 'Vadodara', code: 'BDQ', stateId: 'ST_GJ' },
  ],
};

export const TALUKAS_BY_DISTRICT: Record<string, LocationOption[]> = {
  DIST_PUNE: [
    { id: 'TAL_HAVELI', name: 'Haveli', districtId: 'DIST_PUNE' },
    { id: 'TAL_MUL', name: 'Mulshi', districtId: 'DIST_PUNE' },
    { id: 'TAL_BARAMATI', name: 'Baramati', districtId: 'DIST_PUNE' },
    { id: 'TAL_SHIRUR', name: 'Shirur', districtId: 'DIST_PUNE' },
  ],
  DIST_THANE: [
    { id: 'TAL_THANE', name: 'Thane Tehsil', districtId: 'DIST_THANE' },
    { id: 'TAL_KALYAN', name: 'Kalyan Tehsil', districtId: 'DIST_THANE' },
    { id: 'TAL_BHIWANDI', name: 'Bhiwandi Tehsil', districtId: 'DIST_THANE' },
  ],
  DIST_KANCHI: [
    { id: 'TAL_SRI', name: 'Sriperumbudur', districtId: 'DIST_KANCHI' },
    { id: 'TAL_CHE', name: 'Chengalpattu', districtId: 'DIST_KANCHI' },
  ],
  DIST_CHNAI: [
    { id: 'TAL_EGMORE', name: 'Egmore', districtId: 'DIST_CHNAI' },
    { id: 'TAL_GUINDY', name: 'Guindy', districtId: 'DIST_CHNAI' },
  ],
  DIST_SAS: [
    { id: 'TAL_MHL', name: 'Mohali Tehsil', districtId: 'DIST_SAS' },
    { id: 'TAL_KHARAR', name: 'Kharar Tehsil', districtId: 'DIST_SAS' },
  ],
  DIST_LUDH: [
    { id: 'TAL_LUD_E', name: 'Ludhiana East', districtId: 'DIST_LUDH' },
    { id: 'TAL_LUD_W', name: 'Ludhiana West', districtId: 'DIST_LUDH' },
  ],
  DIST_BLR: [
    { id: 'TAL_BLR_N', name: 'Bengaluru North', districtId: 'DIST_BLR' },
    { id: 'TAL_BLR_S', name: 'Bengaluru South', districtId: 'DIST_BLR' },
  ],
  DIST_AMD: [
    { id: 'TAL_AMD_CITY', name: 'Ahmedabad City', districtId: 'DIST_AMD' },
    { id: 'TAL_DASKROI', name: 'Daskroi Tehsil', districtId: 'DIST_AMD' },
  ],
};

export const VILLAGES_BY_TALUKA: Record<string, LocationOption[]> = {
  TAL_HAVELI: [
    { id: 'LOC_PAUD', name: 'Paud', talukaId: 'TAL_HAVELI', lgdCode: '556421' },
    { id: 'LOC_HAVELI', name: 'Demo Village Haveli', talukaId: 'TAL_HAVELI', lgdCode: '556425' },
  ],
  TAL_MUL: [
    { id: 'LOC_HINJ', name: 'Hinjawadi', talukaId: 'TAL_MUL', lgdCode: '556422' },
    { id: 'LOC_WAKAD', name: 'Wakad', talukaId: 'TAL_MUL', lgdCode: '556423' },
  ],
  TAL_SRI: [
    { id: 'LOC_SRIPER', name: 'Sriperumbudur Central', talukaId: 'TAL_SRI', lgdCode: '631501' },
  ],
  TAL_CHE: [
    { id: 'LOC_TN_DEMO', name: 'Demo Village Kanchipuram', talukaId: 'TAL_CHE', lgdCode: '631505' },
  ],
  TAL_MHL: [
    { id: 'LOC_MHL_VIL', name: 'Phase 7 Sector Locality', talukaId: 'TAL_MHL', lgdCode: '140308' },
  ],
};

export function getCitiesForState(stateId: string): LocationOption[] {
  if (!stateId) return [];
  return DISTRICTS_BY_STATE[stateId] || [
    { id: `DIST_${stateId}_1`, name: 'Central District', stateId }
  ];
}

export function getTalukasForDistrict(districtId: string): LocationOption[] {
  if (!districtId) return [];
  return TALUKAS_BY_DISTRICT[districtId] || [
    { id: `TAL_${districtId}_1`, name: 'Central Tehsil', districtId }
  ];
}

export function getVillagesForTaluka(talukaId: string): LocationOption[] {
  if (!talukaId) return [];
  return VILLAGES_BY_TALUKA[talukaId] || [
    { id: `LOC_${talukaId}_1`, name: 'Central Locality', talukaId }
  ];
}

export function getSubDivisionTerm(stateIdOrName?: string): string {
  if (!stateIdOrName) return 'Taluka / Tehsil';
  const val = stateIdOrName.toUpperCase();
  if (val.includes('TN') || val.includes('TAMIL')) return 'Taluk';
  if (val.includes('PB') || val.includes('PUNJAB') || val.includes('GJ') || val.includes('GUJARAT')) return 'Tehsil';
  return 'Taluka';
}
