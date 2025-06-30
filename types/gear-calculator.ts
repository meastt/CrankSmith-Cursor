// types/gear-calculator.ts - CORRECTED AND EXPANDED

export interface GearRatio {
  chainring: number;
  cog: number;
  ratio: number;
}

export interface GearComparison {
  current: BikeSetup;
  proposed: BikeSetup;
  results: ComparisonResults;
}

// MODIFIED: Added crankset property for correct data modeling
export interface BikeSetup {
  cassette?: Component;
  chainring?: Component;
  crankset?: Component; // Correctly added
  chain?: Component;
  wheel?: Component;
  tire?: Component;
  derailleur?: Component;
  hub?: Component;
}

// MODIFIED: Added chainLength and chainline for integrated results
export interface ComparisonResults {
  performance: PerformanceMetrics;
  weight: WeightComparison;
  compatibility: CompatibilityStatus;
  cost: CostAnalysis;
  chainLength?: ChainLengthResult; // Integrated result
  chainline?: ChainlineResult;   // Integrated result
}

export interface PerformanceMetrics {
  topSpeed: SpeedMetric;
  climbingGear: GearMetric;
  gearRange: RangeMetric;
  gearRatios: GearRatio[];
  efficiency: EfficiencyMetrics;
}

export interface SpeedMetric {
  current: number;
  proposed: number;
  unit: 'mph' | 'kph';
  difference: number;
  percentage: number;
}

export interface GearMetric {
  current: number;
  proposed: number;
  unit: string;
  difference: number;
}

export interface RangeMetric {
  current: number;
  proposed: number;
  unit: '%';
  difference: number;
}

export interface EfficiencyMetrics {
  crossChaining: CrossChainingAnalysis;
  optimalGears: number[];
  efficiencyLoss: number; // percentage
}

export interface CrossChainingAnalysis {
  current: CrossChainingIssue[];
  proposed: CrossChainingIssue[];
  improvement: number; // percentage
}

export interface CrossChainingIssue {
  gear: string; // e.g., "32T x 10T"
  severity: 'low' | 'medium' | 'high';
  efficiencyLoss: number; // percentage
  recommendation: string;
}

export interface WeightComparison {
  current: number;
  proposed: number;
  difference: number;
  unit: 'g';
  percentage: number;
  costPerGram?: number; // $/gram saved
}

export interface CompatibilityStatus {
  status: 'compatible' | 'warning' | 'incompatible';
  issues: CompatibilityIssue[];
  solutions: CompatibilitySolution[];
  confidence: number; // 0-100
  isCompatible: boolean;
  overallStatus: 'compatible' | 'warning' | 'incompatible';
}

export interface CompatibilityIssue {
  type: 'freehub' | 'chain' | 'capacity' | 'chainline' | 'clearance' | 'bcd' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  components: string[];
  costToFix?: number;
  estimatedCost: number;
}

export interface CompatibilitySolution {
  type: 'replace' | 'upgrade' | 'adapter' | 'modification';
  description: string;
  cost: number;
  effort: 'easy' | 'medium' | 'hard';
  reliability: number; // 0-100
  components: string[];
  message: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CostAnalysis {
  current: number;
  proposed: number;
  difference: number;
  currency: 'USD' | 'EUR' | 'GBP';
  includesCompatibilityFixes: boolean;
  breakdown: CostBreakdown[];
}

export interface CostBreakdown {
  component: string;
  currentCost: number;
  proposedCost: number;
  difference: number;
}

export interface Component {
  id: string;
  manufacturer: string;
  model: string;
  year?: number;
  weightGrams?: number;
  msrp?: number;
  category: ComponentCategory;
  imageUrl?: string;
  
  cassette?: CassetteData;
  chainring?: ChainringData;
  chain?: ChainData;
  wheel?: WheelData;
  tire?: TireData;
  derailleur?: DerailleurData;
  hub?: HubData;
  crankset?: CranksetData;
}

export type ComponentCategory = 
  | 'CASSETTE'
  | 'CHAINRING'
  | 'CRANKSET'
  | 'CHAIN'
  | 'WHEEL'
  | 'TIRE'
  | 'DERAILLEUR'
  | 'HUB'
  | 'CRANK'
  | 'BOTTOM_BRACKET'
  | 'SHIFTER'
  | 'BRAKE'
  | 'FORK'
  | 'SHOCK'
  | 'FRAME';

export interface CassetteData {
  speeds: number;
  cogs: number[];
  freehubType: FreehubType;
}

export interface ChainringData {
  teeth: number;
  bcd?: number;
  offset?: number;
}

export interface CranksetData {
  chainrings: number[];
  bcd?: number;
  spindleType?: string;
  offset?: number;
}

export interface ChainData {
  speeds: number;
  links?: number;
}

export interface WheelData {
  diameter: number;
  width?: number;
}

export interface TireData {
  width: number;
  diameter: number;
}

export interface DerailleurData {
  speeds: number;
  maxCog?: number;
  capacity?: number;
}

export interface HubData {
  freehubTypes: FreehubType[];
}

export type FreehubType = 
  | 'SHIMANO_HG'
  | 'SRAM_XD'
  | 'MICRO_SPLINE';

export type AxleType = 
  | 'BOOST_REAR'
  | 'SUPERBOOST_REAR';

export interface CalculatorParams {
  riderWeight?: number;
  bikeWeight?: number;
  cadence?: number;
  wheelDiameter?: number;
  chainstayLength?: number;
}

export interface TirePressureResult {
  frontPSI: number;
  rearPSI: number;
  range: { min: number; max: number };
  notes: string[];
  recommendations: string[];
}

export interface ChainLengthResult {
  links: number;
  length: number;
  tolerance: { min: number; max: number };
  notes: string[];
}

export interface ChainlineResult {
  optimalChainline: number;
  currentChainline: number;
  deviation: number;
  efficiency: number;
  recommendations: string[];
}