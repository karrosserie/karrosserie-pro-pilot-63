
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Types
interface VinInfo {
  brand?: string;
  model?: string;
  year?: number;
}

interface VinResponse {
  success: boolean;
  vin: string;
  data: VinInfo;
  decoded_at: string;
}

// CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

function createCorsResponse(body: any, status: number = 200) {
  return new Response(
    JSON.stringify(body),
    { 
      status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

// Validation VIN
function isValidVin(vin: string): boolean {
  if (!vin || vin.length !== 17) {
    return false;
  }
  const validChars = /^[A-HJ-NPR-Z0-9]+$/i;
  if (!validChars.test(vin)) {
    return false;
  }
  if (vin.includes('I') || vin.includes('O') || vin.includes('Q')) {
    return false;
  }
  return true;
}

// Mapping exhaustif des codes WMI vers les marques
const wmiToBrand: Record<string, string> = {
  // AUDI
  'WAU': 'Audi', 'WA1': 'Audi', 'TRU': 'Audi', 'TRV': 'Audi', 'TRW': 'Audi',
  
  // BMW
  'WBA': 'BMW', 'WBS': 'BMW', 'WBY': 'BMW', '4US': 'BMW', '5UX': 'BMW', '5U1': 'BMW',
  'WBW': 'BMW', 'WBX': 'BMW', 'BWM': 'BMW',
  
  // MERCEDES-BENZ
  'WDD': 'Mercedes-Benz', 'WDB': 'Mercedes-Benz', 'WDC': 'Mercedes-Benz', 'WDF': 'Mercedes-Benz',
  'WDG': 'Mercedes-Benz', 'WDH': 'Mercedes-Benz', 'WDJ': 'Mercedes-Benz', 'WDK': 'Mercedes-Benz',
  '4JG': 'Mercedes-Benz', '55S': 'Mercedes-Benz', 'W1N': 'Mercedes-Benz', 'W1K': 'Mercedes-Benz',
  
  // VOLKSWAGEN
  'WVW': 'Volkswagen', 'WV1': 'Volkswagen', 'WV2': 'Volkswagen', '3VW': 'Volkswagen',
  '1VW': 'Volkswagen', '9BW': 'Volkswagen', 'WVO': 'Volkswagen',
  
  // PEUGEOT
  'VF3': 'Peugeot', 'VF2': 'Peugeot',
  
  // RENAULT
  'VF1': 'Renault', 'VN1': 'Renault', 'VNE': 'Renault',
  
  // CITROËN
  'VF7': 'Citroën', 'VF9': 'Citroën', 'VFE': 'Citroën',
  
  // FORD
  'WF0': 'Ford', '1FA': 'Ford', '1FB': 'Ford', '1FC': 'Ford', '1FD': 'Ford', '1FT': 'Ford',
  '2FA': 'Ford', '3FA': 'Ford', 'MAJ': 'Ford', 'SFA': 'Ford', '1FM': 'Ford', '2FM': 'Ford',
  
  // OPEL
  'W0L': 'Opel', 'W0V': 'Opel', 'W0S': 'Opel',
  
  // TOYOTA
  'JTD': 'Toyota', 'JTE': 'Toyota', 'JTG': 'Toyota', 'JTH': 'Toyota', 'JTJ': 'Toyota',
  'JTK': 'Toyota', 'JTL': 'Toyota', 'JTM': 'Toyota', 'JTN': 'Toyota', '4T1': 'Toyota',
  '5TD': 'Toyota', '5TE': 'Toyota', '5TF': 'Toyota', 'MR0': 'Toyota', 'SB1': 'Toyota',
  
  // HONDA
  'JHM': 'Honda', 'JH4': 'Honda', '1HG': 'Honda', '2HG': 'Honda', '3HG': 'Honda',
  'JHL': 'Honda', 'JHK': 'Honda', '19X': 'Honda',
  
  // NISSAN
  'JN1': 'Nissan', 'JN6': 'Nissan', 'JN8': 'Nissan', '1N4': 'Nissan', '1N6': 'Nissan',
  '3N1': 'Nissan', '3N6': 'Nissan', '5N1': 'Nissan', 'VSK': 'Nissan',
  
  // HYUNDAI
  'KMH': 'Hyundai', 'KMF': 'Hyundai', 'MAL': 'Hyundai', 'MAK': 'Hyundai',
  
  // KIA
  'KNA': 'Kia', 'KND': 'Kia', 'KNE': 'Kia', 'KNM': 'Kia', 'U5Y': 'Kia',
  
  // MAZDA
  'JM1': 'Mazda', 'JM3': 'Mazda', 'JM7': 'Mazda', '4F2': 'Mazda', '4F4': 'Mazda',
  
  // CHEVROLET
  '1G1': 'Chevrolet', '1G2': 'Chevrolet', '1G3': 'Chevrolet', '1GC': 'Chevrolet',
  '1GN': 'Chevrolet', '2G1': 'Chevrolet', '3G1': 'Chevrolet', 'KL1': 'Chevrolet',
  
  // TESLA
  '5YJ': 'Tesla', '7G2': 'Tesla', 'XP7': 'Tesla',
  
  // VOLVO
  'YV1': 'Volvo', 'YV2': 'Volvo', 'YV3': 'Volvo', 'YV4': 'Volvo', 'LVY': 'Volvo',
  
  // PORSCHE
  'WP0': 'Porsche', 'WP1': 'Porsche',
  
  // FERRARI
  'ZFF': 'Ferrari',
  
  // LAMBORGHINI
  'ZHW': 'Lamborghini',
  
  // FIAT
  'ZFA': 'Fiat', 'ZFC': 'Fiat', '3C3': 'Fiat', '3C4': 'Fiat',
  
  // ALFA ROMEO
  'ZAR': 'Alfa Romeo', 'ZAL': 'Alfa Romeo', 'ZAP': 'Alfa Romeo',
  
  // MINI
  'WMW': 'Mini',
  
  // SEAT
  'VSS': 'Seat', 'VWV': 'Seat',
  
  // SKODA
  'TMB': 'Skoda', 'TMA': 'Skoda',
  
  // DACIA
  'UU1': 'Dacia', 'UU7': 'Dacia',
  
  // MITSUBISHI
  'JA3': 'Mitsubishi', 'JA4': 'Mitsubishi', '4A3': 'Mitsubishi', '4A4': 'Mitsubishi',
  
  // SUBARU
  'JF1': 'Subaru', 'JF2': 'Subaru', '4S3': 'Subaru', '4S4': 'Subaru',
  
  // SUZUKI
  'JS1': 'Suzuki', 'JS2': 'Suzuki', 'JS3': 'Suzuki', '2S3': 'Suzuki',
  
  // LEXUS
  '2T2': 'Lexus', '5T2': 'Lexus',
  
  // INFINITI
  'JNK': 'Infiniti',
  
  // ACURA
  '19U': 'Acura', '5J6': 'Acura',
  
  // CADILLAC
  '1G6': 'Cadillac', '1GY': 'Cadillac', '3G6': 'Cadillac',
  
  // LINCOLN
  '1LN': 'Lincoln', '5LM': 'Lincoln',
  
  // BUICK
  '1G4': 'Buick', '2G4': 'Buick', '3G4': 'Buick',
  
  // GMC
  '1GT': 'GMC', '1GK': 'GMC', '2GT': 'GMC',
  
  // DODGE
  '1B3': 'Dodge', '1B7': 'Dodge', '1D3': 'Dodge', '1D4': 'Dodge', '1D7': 'Dodge',
  '2B3': 'Dodge', '2D4': 'Dodge', '3D4': 'Dodge',
  
  // CHRYSLER
  '1C3': 'Chrysler', '2C3': 'Chrysler', '2C4': 'Chrysler',
  
  // JEEP
  '1J4': 'Jeep', '1J8': 'Jeep',
  
  // RAM
  '1C6': 'Ram', '3C6': 'Ram',
  
  // JAGUAR
  'SAJ': 'Jaguar', 'SAL': 'Jaguar',
  
  // LAND ROVER / RANGE ROVER
  'SAH': 'Land Rover', 'SAR': 'Land Rover',
  
  // DS
  'VR3': 'DS', 'VR7': 'DS',
  
  // GENESIS
  'KMA': 'Genesis',
  
  // Marques chinoises
  'LGB': 'Geely', 'LGX': 'Geely', 'LDC': 'Chery', 'LGW': 'Great Wall',
  'LVG': 'BYD', 'LVV': 'BYD', 'LMG': 'MG', 'LNB': 'Nio', 'LXP': 'Xpeng',
  
  // Marques russes
  'XTA': 'Lada', 'XTT': 'Lada', 'XTB': 'UAZ',
  
  // Marques indiennes
  'MAT': 'Tata', 'MA1': 'Mahindra',
  
  // BENTLEY
  'SCB': 'Bentley',
  
  // ROLLS-ROYCE
  'SCA': 'Rolls-Royce',
  
  // ASTON MARTIN
  'SCF': 'Aston Martin',
  
  // MASERATI
  'ZAM': 'Maserati',
  
  // MCLAREN
  'SBM': 'McLaren',
  
  // LOTUS
  'SCC': 'Lotus',
  
  // BUGATTI
  'VF8': 'Bugatti',
  
  // RIVIAN
  '7FA': 'Rivian',
  
  // LUCID
  '5UJ': 'Lucid',
  
  // POLESTAR
  'LPM': 'Polestar',
  
  // ALPINE
  'VF4': 'Alpine',
};

// Mapping avancé des segments VIN vers les modèles par marque
const vinToModel: Record<string, Record<string, string[]>> = {
  'Audi': {
    'A1': ['8X', 'GB', '8X1', '8XF', '8XK', '8XA'],
    'A3': ['8V', '8P', '8L', '8Y', '8V1', '8V2', '8V3', '8V4', '8V7'],
    'A4': ['8K', '8E', '8D', 'B9', '8W', '8K2', '8K5', '8EC', '8ED'],
    'A5': ['8T', '8F', 'F5', '8T3', '8TA', '8F7'],
    'A6': ['4G', '4F', '4B', 'C8', '4G2', '4G5', '4F2', '4F5'],
    'A7': ['4G', 'C8', '4G8', '4GA'],
    'A8': ['4H', '4E', 'D5', '4H2', '4H8', '4HC'],
    'Q2': ['GA', 'GAB'],
    'Q3': ['8U', 'F3', '8UB', '8UG'],
    'Q4 e-tron': ['F4', 'F4E'],
    'Q5': ['8R', 'FY', '8RB', 'FYB'],
    'Q7': ['4L', '4M', '4LB', '4MB'],
    'Q8': ['4M', '4MN'],
    'TT': ['8J', '8S', '8N', '8J3', '8J9', '8S3', '8S7'],
    'R8': ['42', '4S', '420', '423', '4S3', '4S7'],
    'e-tron': ['GE', 'F4', 'GEB', 'GEA'],
    'e-tron GT': ['F7', 'F7A']
  },
  'BMW': {
    'Série 1': ['1M', '1A', '1B', '1C', '1D', '1E', '1F', '1G', '1H', '1J', '1K', '1L', '1N', '1P'],
    'Série 2': ['2A', '2B', '2C', '2D', '2F', '2G', '2H', '2M', '2N'],
    'Série 3': ['3A', '3B', '3C', '3D', '3E', '3F', '3G', '3H', '3K', '3L', '3M', '3N', '3P'],
    'Série 4': ['4A', '4B', '4C', '4D', '4F', '4G', '4H', '4M', '4N'],
    'Série 5': ['5A', '5B', '5C', '5D', '5E', '5F', '5G', '5H', '5K', '5L', '5M', '5N', '5P'],
    'Série 6': ['6A', '6B', '6C', '6D', '6F', '6G', '6H'],
    'Série 7': ['7A', '7B', '7C', '7D', '7F', '7G', '7H', '7L', '7N', '7P'],
    'Série 8': ['8A', '8B', '8C', '8G', '8H'],
    'X1': ['X1', 'U1', 'U11', 'U1X'],
    'X2': ['X2', 'U2', 'U2X'],
    'X3': ['X3', 'U3', 'U31', 'U3X', 'G01'],
    'X4': ['X4', 'U4', 'U4X', 'G02'],
    'X5': ['X5', 'U5', 'U51', 'U5X', 'G05'],
    'X6': ['X6', 'U6', 'U6X', 'G06'],
    'X7': ['X7', 'U7', 'U7X', 'G07'],
    'Z4': ['Z4', 'G29'],
    'i3': ['i3', 'I01'],
    'i4': ['i4', 'G26'],
    'iX': ['iX', 'I20'],
    'iX3': ['iX3', 'G08']
  },
  'Mercedes-Benz': {
    'Classe A': ['176', '177', '169', 'W176', 'W177', 'W169'],
    'Classe B': ['245', '246', '247', 'W245', 'W246', 'W247'],
    'Classe C': ['204', '205', '202', '203', 'W204', 'W205', 'W202', 'W203'],
    'Classe E': ['212', '213', '210', '211', 'W212', 'W213', 'W210', 'W211'],
    'Classe S': ['221', '222', '223', 'W221', 'W222', 'W223'],
    'CLA': ['117', '118', 'C117', 'C118'],
    'CLS': ['218', '219', '257', 'C218', 'C219', 'C257'],
    'GLA': ['156', '247', 'H247', 'X156'],
    'GLB': ['247', 'X247'],
    'GLC': ['253', '254', 'C253', 'C254', 'X253', 'X254'],
    'GLE': ['166', '167', 'W166', 'W167'],
    'GLS': ['166', '167', 'X166', 'X167'],
    'G-Class': ['463', 'W463'],
    'SL': ['230', '231', 'R230', 'R231'],
    'SLC': ['172', 'R172'],
    'AMG GT': ['190', 'C190']
  },
  'Volkswagen': {
    'Polo': ['6R', '6C', '9N', 'AW', '6R1', '6C1', '9N1', '9N3'],
    'Golf': ['1K', '5K', 'AU', 'AJ', 'CD', 'BE', '5K1', '5K5', 'AU1', 'AU5', 'AJ1', 'AJ5'],
    'Jetta': ['1K', 'NCS', 'NF', '1K2', '1K5'],
    'Passat': ['3C', '3B', 'B8', 'B9', '3C2', '3C5', '3B2', '3B3', '3B5', '3B6'],
    'Arteon': ['3H', '3H7'],
    'T-Cross': ['C1', 'C11'],
    'T-Roc': ['A1', 'A11'],
    'Tiguan': ['5N', 'AD', '5N1', '5N2', 'AD1'],
    'Touareg': ['7L', '7P', 'CR', '7L6', '7LA', '7P5', '7P6'],
    'Sharan': ['7M', '7N', '7M8', '7M9', '7N1', '7N2'],
    'Touran': ['1T', '5T', '1T1', '1T2', '1T3', '5T1'],
    'Caddy': ['2K', 'SA', 'SB', '2K7', '2KB', 'SA7', 'SAA', 'SAB'],
    'Crafter': ['2E', '2F', 'SY', 'SZ', '2E6', '2F6'],
    'ID.3': ['E1', 'E11'],
    'ID.4': ['E2', 'E21'],
    'ID.5': ['E3', 'E31'],
    'Up!': ['AA', 'e-up!', 'AA1', 'AA2']
  },
  'Peugeot': {
    '108': ['B3', 'B38'],
    '208': ['CA', 'CC', 'P21', 'CA1', 'CA2', 'CC1', 'CC2'],
    '308': ['4A', '4B', '4C', 'P51', 'P52', '4A1', '4B1', '4C1'],
    '408': ['P5', 'P54'],
    '508': ['8D', '8E', 'R8', 'R81', '8D1', '8E1'],
    '2008': ['A9', 'P24', 'A94', 'A95'],
    '3008': ['0U', 'P84', '0U1', '0U2'],
    '5008': ['0A', 'P87', '0A1', '0A2'],
    'Partner': ['B9', 'K9', 'B96', 'B97', 'K96', 'K97'],
    'Rifter': ['K9', 'K96', 'K97'],
    'Expert': ['G9', 'K0', 'G98', 'G99', 'K01', 'K05'],
    'Boxer': ['Y', 'Y3', 'Y4'],
    'e-208': ['P21', 'P2'],
    'e-2008': ['P24', 'P2'],
    'RCZ': ['4C', '4C1'],
    '207': ['LHA', 'LHAH', 'WA', 'WB', 'WC']
  },
  'Renault': {
    'Twingo': ['CN0', 'BC', 'CN01', 'CN04', 'BC0'],
    'Clio': ['BR', 'BS', 'BH', 'BV', 'BR0', 'BR1', 'BS1', 'BH5', 'BV5'],
    'Mégane': ['BA', 'BM', 'BZ', 'BF', 'BA0', 'BA1', 'BM0', 'BZ0', 'BF0'],
    'Talisman': ['LP', 'L2M'],
    'Captur': ['J5', 'HF', 'J5A', 'J5B', 'HFA', 'HFB'],
    'Kadjar': ['HA', 'HF', 'HAA', 'HAB', 'HFA', 'HFB'],
    'Koleos': ['HY', 'HZ', 'HY0', 'HZ0'],
    'Espace': ['JE', 'JF', 'JE0', 'JF0'],
    'Scenic': ['JA', 'JZ', 'JA0', 'JA1', 'JZ0', 'JZ1'],
    'Kangoo': ['FC', 'FW', 'W', 'FC0', 'FC1', 'FW0', 'W57'],
    'Trafic': ['FL', 'JL', 'FL0', 'JL0'],
    'Master': ['FV', 'JV', 'FV0', 'JV0'],
    'ZOE': ['AG', 'BF', 'AG0', 'BF0'],
    'Arkana': ['LJ', 'LJA'],
    'Austral': ['QM', 'QMA']
  },
  'Citroën': {
    'C1': ['PM', 'PN', 'PM1', 'PN1'],
    'C3': ['FC', 'SC', 'A51', 'CC', 'FC1', 'SC1', 'A511', 'CC1'],
    'C4': ['B7', 'N2', 'LC', 'DC', 'B71', 'N21', 'LC1', 'DC1'],
    'C5': ['DC', 'DE', 'RD', 'X7', 'DC1', 'DE1', 'RD1', 'X71'],
    'C3 Aircross': ['SX', 'CC', 'SX1', 'CC1'],
    'C5 Aircross': ['P8', 'P84'],
    'Berlingo': ['B9', 'MF', 'VP', 'K9', 'B96', 'B97', 'MF6', 'VP6', 'K96'],
    'Jumpy': ['G9', 'K0', 'G98', 'G99', 'K01'],
    'Jumper': ['Y', 'Y3', 'Y4'],
    'Ami': ['MY', 'MY1'],
    'ë-C4': ['DC', 'DC1'],
    'ë-Berlingo': ['K9', 'K96']
  },
  'Toyota': {
    'Aygo': ['AB', 'B4', 'AB1', 'AB4', 'B40'],
    'Yaris': ['CP', 'NCP', 'NLP', 'XP', 'CP1', 'NCP1', 'NLP1', 'XP9', 'XP13'],
    'Corolla': ['ZZE', 'ZRE', 'NRE', 'E12', 'E15', 'E21', 'ZZE12', 'ZRE15', 'NRE18'],
    'Camry': ['ACV', 'GSV', 'ASV', 'ACV4', 'GSV4', 'ASV7'],
    'Avensis': ['ZZT', 'AZT', 'ZZT25', 'AZT25'],
    'C-HR': ['NGX', 'ZYX', 'NGX1', 'NGX5', 'ZYX1'],
    'RAV4': ['ACA', 'ZCA', 'XA', 'ACA2', 'ZCA2', 'XA3', 'XA5'],
    'Highlander': ['GSU', 'ASU', 'GSU4', 'ASU5'],
    'Land Cruiser': ['UZJ', 'HDJ', 'VDJ', 'UZJ1', 'HDJ1', 'VDJ2'],
    'Prius': ['NHW', 'ZVW', 'NHW2', 'ZVW3', 'ZVW5'],
    'Mirai': ['JPD', 'JPD1'],
    'Hilux': ['KUN', 'GGN', 'TGN', 'KUN1', 'KUN2', 'GGN1', 'TGN1'],
    'Supra': ['JZA', 'DB', 'JZA8', 'DB4', 'DB9'],
    'GT86': ['ZN', 'ZN6'],
    'Yaris Cross': ['MX', 'MXP', 'MX1', 'MXP1'],
    'bZ4X': ['XM', 'XM1']
  },
  'Honda': {
    'Jazz': ['GD', 'GE', 'GK', 'GD1', 'GD3', 'GE6', 'GE8', 'GK5'],
    'Civic': ['EP', 'FN', 'FK', 'FC', 'EP3', 'FN2', 'FK2', 'FK8', 'FC1'],
    'Accord': ['CL', 'CM', 'CU', 'CR', 'CL7', 'CL9', 'CM1', 'CU1', 'CR1'],
    'HR-V': ['GH', 'RU', 'GH1', 'GH3', 'RU1'],
    'CR-V': ['RD', 'RE', 'RM', 'RT', 'RD1', 'RE3', 'RM1', 'RT6'],
    'Pilot': ['YF', 'YF3', 'YF4'],
    'Insight': ['ZE', 'ZE2', 'ZE3'],
    'NSX': ['NA', 'NC', 'NA1', 'NA2', 'NC1'],
    'S2000': ['AP', 'AP1', 'AP2']
  },
  'Nissan': {
    'Micra': ['K11', 'K12', 'K13', 'K14'],
    'Note': ['E11', 'E12'],
    'Sentra': ['B15', 'B16', 'B17'],
    'Altima': ['L31', 'L32', 'L33', 'L34'],
    'Maxima': ['A32', 'A33', 'A34', 'A35', 'A36'],
    'Juke': ['F15', 'F16'],
    'Qashqai': ['J10', 'J11'],
    'X-Trail': ['T30', 'T31', 'T32', 'T33'],
    'Murano': ['Z50', 'Z51', 'Z52'],
    'Pathfinder': ['R51', 'R52'],
    'Leaf': ['ZE0', 'ZE1'],
    'Ariya': ['PD33'],
    '370Z': ['Z34'],
    'GT-R': ['R35'],
    'Navara': ['D22', 'D40']
  },
  'Ford': {
    'Fiesta': ['B2', 'JA', 'JH', 'CB1'],
    'Focus': ['DA', 'DB', 'DM', 'C346', 'C519'],
    'Mondeo': ['BA', 'GE', 'CD345'],
    'Mustang': ['S197', 'S550'],
    'EcoSport': ['BK'],
    'Kuga': ['DM2'],
    'Edge': ['CD4'],
    'Explorer': ['U502'],
    'F-150': ['P415'],
    'Ranger': ['TKE'],
    'Transit': ['TTF', 'TTE'],
    'Puma': ['MEB'],
    'Bronco': ['U725'],
    'Mustang Mach-E': ['CD542']
  },
  'Chevrolet': {
    'Spark': ['M300'],
    'Sonic': ['T300'],
    'Cruze': ['J300', 'J400'],
    'Malibu': ['A3XX'],
    'Impala': ['W-body'],
    'Trax': ['X12NI'],
    'Equinox': ['L850'],
    'Traverse': ['C1XX'],
    'Tahoe': ['K1XX'],
    'Silverado': ['K2XX'],
    'Camaro': ['SS', 'ZL1'],
    'Corvette': ['C7', 'C8'],
    'Bolt': ['EV']
  },
  'Hyundai': {
    'i10': ['PA', 'IA'],
    'i20': ['PB', 'GB'],
    'i30': ['FD', 'GD', 'PD'],
    'Elantra': ['AD', 'CN7'],
    'Sonata': ['YF', 'LF'],
    'Kona': ['OS'],
    'Tucson': ['JM', 'TL', 'NX4'],
    'Santa Fe': ['CM', 'DM', 'TM'],
    'Palisade': ['LX2'],
    'Ioniq': ['AE'],
    'Ioniq 5': ['NE'],
    'Ioniq 6': ['SE'],
    'Veloster': ['FS']
  },
  'Kia': {
    'Picanto': ['BA', 'TA', 'JA'],
    'Rio': ['DC', 'UB', 'YB'],
    'Forte': ['TD', 'BD'],
    'Optima': ['MG', 'TF', 'JF'],
    'Stinger': ['CK'],
    'Soul': ['AM', 'PS', 'SK3'],
    'Seltos': ['SP2'],
    'Sportage': ['KM', 'SL', 'QL', 'NQ5'],
    'Sorento': ['BL', 'XM', 'UM', 'MQ4'],
    'Telluride': ['ON'],
    'Niro': ['DE'],
    'EV6': ['CV'],
    'Carnival': ['KA4'],
    'Ceed': ['JD'],
    'XCeed': ['CD'],
    'Stonic': ['YB']
  },
  'Mazda': {
    'Mazda2': ['DE', 'DJ'],
    'Mazda3': ['BK', 'BL', 'BM', 'BP'],
    'Mazda6': ['GG', 'GH', 'GJ', 'GL'],
    'CX-3': ['DK'],
    'CX-30': ['DM'],
    'CX-5': ['KE', 'KF'],
    'CX-9': ['TB', 'TC'],
    'MX-5': ['NA', 'NB', 'NC', 'ND'],
    'MX-30': ['DR']
  },
  'Tesla': {
    'Model S': ['MS'],
    'Model 3': ['M3'],
    'Model X': ['MX'],
    'Model Y': ['MY'],
    'Cybertruck': ['CT'],
    'Roadster': ['R1', 'R2']
  }
};

// Mapping année
const yearMapping: Record<string, number> = {
  'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
  'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
  'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
  'S': 2025, 'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029,
  'Y': 2030, 'Z': 2031,
  '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005,
  '6': 2006, '7': 2007, '8': 2008, '9': 2009
};

// Décodage VIN avec détection avancée du modèle
function decodeVin(vin: string): VinInfo {
  if (!vin || vin.length !== 17) {
    return {};
  }

  // Extraire le WMI (3 premiers caractères)
  const wmi = vin.substring(0, 3);
  
  // Trouver la marque
  const brand = wmiToBrand[wmi];
  
  if (!brand) {
    // Essayer avec les 2 premiers caractères si pas de correspondance avec 3
    const wmi2 = vin.substring(0, 2);
    const brandFromWmi2 = wmiToBrand[wmi2];
    if (brandFromWmi2) {
      return { brand: brandFromWmi2 };
    }
    return {};
  }

  // Extraire l'année (10ème caractère)
  const yearChar = vin.charAt(9);
  let year: number | undefined;
  
  if (yearMapping[yearChar]) {
    year = yearMapping[yearChar];
  }

  // Détection avancée du modèle
  let model: string | undefined;
  const modelCodes = vinToModel[brand];
  
  if (modelCodes) {
    // Extraire différents segments du VIN pour la détection de modèle
    const segment1 = vin.substring(3, 5);   // Positions 4-5
    const segment2 = vin.substring(4, 6);   // Positions 5-6
    const segment3 = vin.substring(5, 7);   // Positions 6-7
    const segment4 = vin.substring(3, 8);   // Positions 4-8 (VDS complet)
    const segment5 = vin.substring(6, 8);   // Positions 7-8
    const segment6 = vin.substring(7, 9);   // Positions 8-9
    const segment7 = vin.substring(3, 7);   // Positions 4-7 (LHAH pour Peugeot 207)
    
    // Recherche par ordre de priorité
    for (const [modelName, codes] of Object.entries(modelCodes)) {
      // Recherche exacte dans les segments
      const found = codes.some(code => {
        return segment1 === code || 
               segment2 === code || 
               segment3 === code ||
               segment5 === code ||
               segment6 === code ||
               segment7 === code ||
               segment4.includes(code) ||
               vin.substring(3, 3 + code.length) === code;
      });
      
      if (found) {
        model = modelName;
        break;
      }
    }
    
    // Si pas de correspondance exacte, recherche partielle
    if (!model) {
      for (const [modelName, codes] of Object.entries(modelCodes)) {
        const found = codes.some(code => 
          segment4.includes(code) || 
          vin.includes(code)
        );
        
        if (found) {
          model = modelName;
          break;
        }
      }
    }
  }

  console.log('VIN décodé - WMI:', wmi, 'brand:', brand, 'model:', model, 'year:', year);
  
  return {
    brand,
    model,
    year
  };
}

// Fonction principale
serve(async (req) => {
  // Gérer OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Seules GET et POST autorisées
    if (req.method !== 'GET' && req.method !== 'POST') {
      return createCorsResponse({ error: 'Method not allowed' }, 405);
    }

    let vin: string = '';

    // Récupérer le VIN
    if (req.method === 'GET') {
      const url = new URL(req.url)
      vin = url.searchParams.get('vin') || ''
    } else if (req.method === 'POST') {
      try {
        // Vérifier si le body existe et n'est pas vide
        const text = await req.text();
        if (text.trim()) {
          const body = JSON.parse(text);
          vin = body.vin || '';
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return createCorsResponse({ 
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON with vin property'
        }, 400);
      }
    }

    // Valider le VIN
    if (!vin) {
      return createCorsResponse({ 
        error: 'VIN is required',
        message: 'Please provide a VIN number as query parameter (?vin=...) or in request body {vin: "..."}'
      }, 400);
    }

    const cleanVin = vin.toUpperCase().trim()
    
    if (!isValidVin(cleanVin)) {
      return createCorsResponse({ 
        error: 'Invalid VIN',
        message: 'VIN must be 17 characters long and contain only valid characters (A-Z, 0-9, excluding I, O, Q)'
      }, 400);
    }

    // Décoder le VIN
    const vinInfo = decodeVin(cleanVin)

    // Retourner la réponse
    const response: VinResponse = {
      success: true,
      vin: cleanVin,
      data: vinInfo,
      decoded_at: new Date().toISOString()
    };

    return createCorsResponse(response);

  } catch (error) {
    console.error('Error in VIN decoder API:', error)
    
    return createCorsResponse({ 
      error: 'Internal server error',
      message: 'An error occurred while processing the VIN'
    }, 500);
  }
})
