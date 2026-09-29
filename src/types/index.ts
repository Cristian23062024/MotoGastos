export type Language = 'es' | 'en' | 'ja';
export type ThemeMode = 'dark' | 'light';
export type ScreenId = 'home' | 'scan' | 'analyzing' | 'specs' | 'expenses';
export type DeviceType = 'iphone' | 'galaxy' | 'pixel' | 'fullscreen';

export interface Motorcycle {
  id: string;
  name: string;
  line: string;
  category: string;
  cc: number;
  modelYear: number;
  city: string;
  projectionKm: number;
  heroImage: string;
  specsImage: string;
  scanThumbnail: string;
  rendimientoKmPerL: number;
  autonomiaKm: number;
  pesoSecoKg: number;
  soatTariff: string;
  confidencePercent: number;
  usageType: string;
  engineType: string;
  efficiencyRating: string;
  expenses: {
    soat: number;
    tecnomecanica: number;
    impuesto: number;
    gasolina: number;
    mantenimiento: number;
  };
}

export interface ExpenseCalculationParams {
  annualKm: number;
  gasPricePerGallon: number;
  fuelEfficiencyKmPerLiter: number;
  maintenanceAnnual: number;
  soatRate: number;
  tecnomecanicaRate: number;
  impuestoRate: number;
  city: string;
}
