// ISO-3 codes and metadata for all 55 African Union member states.
// Used by the ingestion pipeline to scope every API call to Africa.
//
// `wbCode` is the World Bank country code (almost always ISO-3, but WB uses a
// few non-standard codes — e.g. ZAR for DRC historically). All current African
// states are at standard ISO-3 today.
//
// `region` follows the AU's own 5-region scheme used in the Second Continental
// Report on Agenda 2063 (North / East / West / Central / Southern).

export interface AfricanCountry {
  iso3: string
  iso2: string
  name: string
  region: 'North' | 'East' | 'West' | 'Central' | 'Southern'
  wbCode: string // World Bank uses ISO3 for all current African states
}

export const AFRICAN_COUNTRIES: AfricanCountry[] = [
  // North Africa (7)
  { iso3: 'DZA', iso2: 'DZ', name: 'Algeria', region: 'North', wbCode: 'DZA' },
  { iso3: 'EGY', iso2: 'EG', name: 'Egypt', region: 'North', wbCode: 'EGY' },
  { iso3: 'LBY', iso2: 'LY', name: 'Libya', region: 'North', wbCode: 'LBY' },
  { iso3: 'MAR', iso2: 'MA', name: 'Morocco', region: 'North', wbCode: 'MAR' },
  { iso3: 'SDN', iso2: 'SD', name: 'Sudan', region: 'North', wbCode: 'SDN' },
  { iso3: 'TUN', iso2: 'TN', name: 'Tunisia', region: 'North', wbCode: 'TUN' },
  { iso3: 'ESH', iso2: 'EH', name: 'Western Sahara (SADR)', region: 'North', wbCode: 'ESH' },

  // West Africa (15)
  { iso3: 'BEN', iso2: 'BJ', name: 'Benin', region: 'West', wbCode: 'BEN' },
  { iso3: 'BFA', iso2: 'BF', name: 'Burkina Faso', region: 'West', wbCode: 'BFA' },
  { iso3: 'CPV', iso2: 'CV', name: 'Cabo Verde', region: 'West', wbCode: 'CPV' },
  { iso3: 'CIV', iso2: 'CI', name: "Côte d'Ivoire", region: 'West', wbCode: 'CIV' },
  { iso3: 'GMB', iso2: 'GM', name: 'Gambia', region: 'West', wbCode: 'GMB' },
  { iso3: 'GHA', iso2: 'GH', name: 'Ghana', region: 'West', wbCode: 'GHA' },
  { iso3: 'GIN', iso2: 'GN', name: 'Guinea', region: 'West', wbCode: 'GIN' },
  { iso3: 'GNB', iso2: 'GW', name: 'Guinea-Bissau', region: 'West', wbCode: 'GNB' },
  { iso3: 'LBR', iso2: 'LR', name: 'Liberia', region: 'West', wbCode: 'LBR' },
  { iso3: 'MLI', iso2: 'ML', name: 'Mali', region: 'West', wbCode: 'MLI' },
  { iso3: 'MRT', iso2: 'MR', name: 'Mauritania', region: 'West', wbCode: 'MRT' },
  { iso3: 'NER', iso2: 'NE', name: 'Niger', region: 'West', wbCode: 'NER' },
  { iso3: 'NGA', iso2: 'NG', name: 'Nigeria', region: 'West', wbCode: 'NGA' },
  { iso3: 'SEN', iso2: 'SN', name: 'Senegal', region: 'West', wbCode: 'SEN' },
  { iso3: 'SLE', iso2: 'SL', name: 'Sierra Leone', region: 'West', wbCode: 'SLE' },
  { iso3: 'TGO', iso2: 'TG', name: 'Togo', region: 'West', wbCode: 'TGO' },

  // East Africa (13)
  { iso3: 'BDI', iso2: 'BI', name: 'Burundi', region: 'East', wbCode: 'BDI' },
  { iso3: 'COM', iso2: 'KM', name: 'Comoros', region: 'East', wbCode: 'COM' },
  { iso3: 'DJI', iso2: 'DJ', name: 'Djibouti', region: 'East', wbCode: 'DJI' },
  { iso3: 'ERI', iso2: 'ER', name: 'Eritrea', region: 'East', wbCode: 'ERI' },
  { iso3: 'ETH', iso2: 'ET', name: 'Ethiopia', region: 'East', wbCode: 'ETH' },
  { iso3: 'KEN', iso2: 'KE', name: 'Kenya', region: 'East', wbCode: 'KEN' },
  { iso3: 'MDG', iso2: 'MG', name: 'Madagascar', region: 'East', wbCode: 'MDG' },
  { iso3: 'MUS', iso2: 'MU', name: 'Mauritius', region: 'East', wbCode: 'MUS' },
  { iso3: 'RWA', iso2: 'RW', name: 'Rwanda', region: 'East', wbCode: 'RWA' },
  { iso3: 'SYC', iso2: 'SC', name: 'Seychelles', region: 'East', wbCode: 'SYC' },
  { iso3: 'SOM', iso2: 'SO', name: 'Somalia', region: 'East', wbCode: 'SOM' },
  { iso3: 'SSD', iso2: 'SS', name: 'South Sudan', region: 'East', wbCode: 'SSD' },
  { iso3: 'TZA', iso2: 'TZ', name: 'Tanzania', region: 'East', wbCode: 'TZA' },
  { iso3: 'UGA', iso2: 'UG', name: 'Uganda', region: 'East', wbCode: 'UGA' },

  // Central Africa (9)
  { iso3: 'AGO', iso2: 'AO', name: 'Angola', region: 'Central', wbCode: 'AGO' },
  { iso3: 'CMR', iso2: 'CM', name: 'Cameroon', region: 'Central', wbCode: 'CMR' },
  { iso3: 'CAF', iso2: 'CF', name: 'Central African Republic', region: 'Central', wbCode: 'CAF' },
  { iso3: 'TCD', iso2: 'TD', name: 'Chad', region: 'Central', wbCode: 'TCD' },
  { iso3: 'COG', iso2: 'CG', name: 'Republic of Congo', region: 'Central', wbCode: 'COG' },
  { iso3: 'COD', iso2: 'CD', name: 'DR Congo', region: 'Central', wbCode: 'COD' },
  { iso3: 'GNQ', iso2: 'GQ', name: 'Equatorial Guinea', region: 'Central', wbCode: 'GNQ' },
  { iso3: 'GAB', iso2: 'GA', name: 'Gabon', region: 'Central', wbCode: 'GAB' },
  { iso3: 'STP', iso2: 'ST', name: 'São Tomé and Príncipe', region: 'Central', wbCode: 'STP' },

  // Southern Africa (10)
  { iso3: 'BWA', iso2: 'BW', name: 'Botswana', region: 'Southern', wbCode: 'BWA' },
  { iso3: 'SWZ', iso2: 'SZ', name: 'Eswatini', region: 'Southern', wbCode: 'SWZ' },
  { iso3: 'LSO', iso2: 'LS', name: 'Lesotho', region: 'Southern', wbCode: 'LSO' },
  { iso3: 'MWI', iso2: 'MW', name: 'Malawi', region: 'Southern', wbCode: 'MWI' },
  { iso3: 'MOZ', iso2: 'MZ', name: 'Mozambique', region: 'Southern', wbCode: 'MOZ' },
  { iso3: 'NAM', iso2: 'NA', name: 'Namibia', region: 'Southern', wbCode: 'NAM' },
  { iso3: 'ZAF', iso2: 'ZA', name: 'South Africa', region: 'Southern', wbCode: 'ZAF' },
  { iso3: 'ZMB', iso2: 'ZM', name: 'Zambia', region: 'Southern', wbCode: 'ZMB' },
  { iso3: 'ZWE', iso2: 'ZW', name: 'Zimbabwe', region: 'Southern', wbCode: 'ZWE' },
]

// AU recognises 55 member states; this list is the full membership.
export const AU_MEMBER_STATES = AFRICAN_COUNTRIES

export const COUNTRIES_BY_REGION = {
  North: AU_MEMBER_STATES.filter((c) => c.region === 'North'),
  East: AU_MEMBER_STATES.filter((c) => c.region === 'East'),
  West: AU_MEMBER_STATES.filter((c) => c.region === 'West'),
  Central: AU_MEMBER_STATES.filter((c) => c.region === 'Central'),
  Southern: AU_MEMBER_STATES.filter((c) => c.region === 'Southern'),
}
