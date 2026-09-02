/**
 * Curated brand → models for vehicle forms (buyer/seller markets).
 * Extend `CAR_CATALOG` as needed; API still stores free-text brand/model.
 */

export interface CarBrandEntry {
  name: string;
  models: string[];
}

/** Alphabetical by brand name */
export const CAR_CATALOG: CarBrandEntry[] = [
  {
    name: 'Audi',
    models: [
      'A1',
      'A3',
      'A4',
      'A5',
      'A6',
      'A7',
      'A8',
      'Q2',
      'Q3',
      'Q4 e-tron',
      'Q5',
      'Q7',
      'Q8',
      'TT',
      'e-tron',
      'e-tron GT',
    ],
  },
  {
    name: 'BMW',
    models: [
      '1 Series',
      '2 Series',
      '3 Series',
      '4 Series',
      '5 Series',
      '6 Series',
      '7 Series',
      '8 Series',
      'X1',
      'X2',
      'X3',
      'X4',
      'X5',
      'X6',
      'X7',
      'Z4',
      'i3',
      'i4',
      'iX',
      'iX3',
    ],
  },
  {
    name: 'Chevrolet',
    models: [
      'Aveo',
      'Captiva',
      'Cruze',
      'Epica',
      'Lacetti',
      'Malibu',
      'Niva',
      'Orlando',
      'Spark',
      'Tahoe',
      'Tracker',
      'TrailBlazer',
    ],
  },
  {
    name: 'Citroën',
    models: ['Berlingo', 'C3', 'C4', 'C5', 'C-Elysée', 'Jumpy', 'SpaceTourer'],
  },
  {
    name: 'Dacia',
    models: ['Dokker', 'Duster', 'Lodgy', 'Logan', 'Sandero', 'Spring'],
  },
  {
    name: 'Fiat',
    models: ['500', '500L', '500X', 'Doblo', 'Ducato', 'Linea', 'Panda', 'Tipo'],
  },
  {
    name: 'Ford',
    models: [
      'B-Max',
      'C-Max',
      'EcoSport',
      'Edge',
      'Escape',
      'Explorer',
      'Fiesta',
      'Focus',
      'Fusion',
      'Galaxy',
      'Kuga',
      'Mondeo',
      'Mustang',
      'Ranger',
      'S-Max',
      'Transit',
    ],
  },
  {
    name: 'Honda',
    models: [
      'Accord',
      'CR-V',
      'CR-Z',
      'Civic',
      'Fit',
      'HR-V',
      'Insight',
      'Jazz',
      'Legend',
      'Odyssey',
      'Pilot',
      'Ridgeline',
    ],
  },
  {
    name: 'Hyundai',
    models: [
      'Accent',
      'Azera',
      'Bayon',
      'Elantra',
      'Genesis',
      'Getz',
      'Grandeur',
      'i10',
      'i20',
      'i30',
      'i40',
      'Ioniq',
      'Ioniq 5',
      'Ioniq 6',
      'Kona',
      'Palisade',
      'Santa Fe',
      'Sonata',
      'Tucson',
      'Veloster',
      'Venue',
    ],
  },
  {
    name: 'Kia',
    models: [
      'Carens',
      'Carnival',
      'Ceed',
      'Cerato',
      'EV6',
      'EV9',
      'Niro',
      'Optima',
      'Picanto',
      'Rio',
      'Seltos',
      'Sorento',
      'Soul',
      'Sportage',
      'Stinger',
      'Telluride',
    ],
  },
  {
    name: 'Lada',
    models: ['Granta', 'Kalina', 'Largus', 'Niva', 'Priora', 'Vesta', 'XRAY'],
  },
  {
    name: 'Land Rover',
    models: ['Defender', 'Discovery', 'Discovery Sport', 'Freelander', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'],
  },
  {
    name: 'Lexus',
    models: ['CT', 'ES', 'GS', 'GX', 'IS', 'LC', 'LS', 'LX', 'NX', 'RC', 'RX', 'RZ', 'UX'],
  },
  {
    name: 'Mazda',
    models: ['2', '3', '5', '6', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'CX-7', 'CX-9', 'MX-30', 'MX-5', 'RX-8'],
  },
  {
    name: 'Mercedes-Benz',
    models: [
      'A-Class',
      'B-Class',
      'C-Class',
      'CLA',
      'CLS',
      'E-Class',
      'EQA',
      'EQB',
      'EQC',
      'EQE',
      'EQS',
      'G-Class',
      'GLA',
      'GLB',
      'GLC',
      'GLE',
      'GLS',
      'S-Class',
      'SL',
      'SLC',
      'Sprinter',
      'V-Class',
      'Vito',
    ],
  },
  {
    name: 'Mitsubishi',
    models: ['ASX', 'Colt', 'Eclipse Cross', 'L200', 'Lancer', 'Outlander', 'Pajero', 'Space Star'],
  },
  {
    name: 'Nissan',
    models: [
      'Almera',
      'Altima',
      'Ariya',
      'Juke',
      'Leaf',
      'Maxima',
      'Micra',
      'Murano',
      'Navara',
      'Note',
      'Pathfinder',
      'Patrol',
      'Qashqai',
      'Sentra',
      'Skyline',
      'Tiida',
      'X-Trail',
    ],
  },
  {
    name: 'Opel',
    models: ['Adam', 'Astra', 'Corsa', 'Crossland', 'Grandland', 'Insignia', 'Meriva', 'Mokka', 'Vectra', 'Zafira'],
  },
  {
    name: 'Peugeot',
    models: ['1007', '2008', '208', '3008', '301', '308', '408', '5008', '508', 'Boxer', 'Expert', 'Partner', 'Rifter'],
  },
  {
    name: 'Porsche',
    models: ['718', '911', 'Boxster', 'Cayenne', 'Cayman', 'Macan', 'Panamera', 'Taycan'],
  },
  {
    name: 'Renault',
    models: ['Arkana', 'Austral', 'Captur', 'Clio', 'Duster', 'Espace', 'Fluence', 'Kadjar', 'Kangoo', 'Koleos', 'Laguna', 'Megane', 'Scenic', 'Talisman', 'Twingo'],
  },
  {
    name: 'Skoda',
    models: ['Citigo', 'Enyaq', 'Fabia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Rapid', 'Scala', 'Superb', 'Yeti'],
  },
  {
    name: 'Subaru',
    models: ['BRZ', 'Crosstrek', 'Forester', 'Impreza', 'Legacy', 'Levorg', 'Outback', 'WRX', 'XV'],
  },
  {
    name: 'Suzuki',
    models: ['Across', 'Baleno', 'Ignis', 'Jimny', 'S-Cross', 'Swift', 'SX4', 'Vitara'],
  },
  {
    name: 'Tesla',
    models: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'],
  },
  {
    name: 'Toyota',
    models: [
      '4Runner',
      'Auris',
      'Avensis',
      'Aygo',
      'C-HR',
      'Camry',
      'Corolla',
      'Corolla Cross',
      'FJ Cruiser',
      'Highlander',
      'Hilux',
      'Land Cruiser',
      'Prius',
      'RAV4',
      'Sequoia',
      'Sienna',
      'Tacoma',
      'Tundra',
      'Venza',
      'Yaris',
      'bZ4X',
    ],
  },
  {
    name: 'Volkswagen',
    models: [
      'Amarok',
      'Arteon',
      'Beetle',
      'Bora',
      'Caddy',
      'California',
      'Caravelle',
      'CC',
      'Crafter',
      'Eos',
      'Golf',
      'ID.3',
      'ID.4',
      'ID.5',
      'Jetta',
      'Multivan',
      'Passat',
      'Polo',
      'Scirocco',
      'Sharan',
      'T-Cross',
      'T-Roc',
      'Taigo',
      'Tiguan',
      'Touareg',
      'Touran',
      'Transporter',
      'up!',
    ],
  },
  {
    name: 'Volvo',
    models: ['C30', 'C70', 'EX30', 'EX90', 'S40', 'S60', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 'XC40', 'XC60', 'XC70', 'XC90'],
  },
].sort((a, b) => a.name.localeCompare(b.name));

const catalogByNameLower = new Map(CAR_CATALOG.map((e) => [e.name.toLowerCase(), e]));

export function findBrandEntry(brandName: string): CarBrandEntry | undefined {
  const key = brandName.trim().toLowerCase();
  if (!key) return undefined;
  return catalogByNameLower.get(key);
}

/** Sorted brand names, with legacy value first if not in catalog */
export function brandOptionsIncludingLegacy(legacyBrand: string): string[] {
  const names = CAR_CATALOG.map((b) => b.name);
  const l = legacyBrand.trim();
  if (!l) return names;
  if (names.some((n) => n.toLowerCase() === l.toLowerCase())) return names;
  return [l, ...names];
}

/** Sorted models for a catalog brand; prepends legacy model if missing from list */
export function modelOptionsForBrand(brandName: string, legacyModel: string): string[] {
  const entry = findBrandEntry(brandName);
  if (!entry) return [];
  const models = [...entry.models].sort((a, b) => a.localeCompare(b));
  const m = legacyModel.trim();
  if (!m) return models;
  if (models.some((x) => x.toLowerCase() === m.toLowerCase())) return models;
  return [m, ...models];
}
