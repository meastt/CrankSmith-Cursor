// types/gear-calculator.ts - Fixed version

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

export interface BikeSetup {
  cassette?: Component;
  chainring?: Component;
  chain?: Component;
  wheel?: Component;
  tire?: Component;
  derailleur?: Component;
  hub?: Component;
}

export interface ComparisonResults {
  performance: PerformanceMetrics;
  weight: WeightComparison;
  compatibility: CompatibilityStatus;
  cost: CostAnalysis;
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

// Fixed CompatibilityStatus interface to match usage
export interface CompatibilityStatus {
  status: 'compatible' | 'warning' | 'incompatible';
  issues: CompatibilityIssue[];
  solutions: CompatibilitySolution[];
  confidence: number; // 0-100
  // Added properties that are being used in components
  isCompatible: boolean;
  overallStatus: 'compatible' | 'warning' | 'incompatible';
}

// Fixed CompatibilityIssue interface to match usage
export interface CompatibilityIssue {
  type: 'freehub' | 'chain' | 'capacity' | 'chainline' | 'clearance' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  components: string[];
  costToFix?: number;
  // Added property that is being used
  estimatedCost: number;
}

// Fixed CompatibilitySolution interface to match usage
export interface CompatibilitySolution {
  type: 'replace' | 'upgrade' | 'adapter' | 'modification';
  description: string;
  cost: number;
  effort: 'easy' | 'medium' | 'hard';
  reliability: number; // 0-100
  // Added properties that are being used
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
  
  // Specific component data
  cassette?: CassetteData;
  chainring?: ChainringData;
  chain?: ChainData;
  wheel?: WheelData;
  tire?: TireData;
  derailleur?: DerailleurData;
  hub?: HubData;
}

export type ComponentCategory = 
  | 'CASSETTE'
  | 'CHAINRING'
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
  spacing?: number;
  material?: string;
  maxTorque?: number;
}

export interface ChainringData {
  teeth: number;
  bcd?: number;
  offset?: number;
  material?: string;
}

export interface ChainData {
  speeds: number;
  material?: string;
  links?: number;
}

export interface WheelData {
  diameter: number; // inches
  width?: number; // mm
  material?: string;
  spokeCount?: number;
}

export interface TireData {
  width: number; // inches
  diameter: number; // inches
  compound?: string;
  casing?: string;
  tpi?: number;
}

export interface DerailleurData {
  speeds: number;
  maxCapacity?: number;
  maxCog?: number; // Added this property that's being used
  capacity?: number; // Added this property that's being used
  cageLength?: 'SHORT' | 'MEDIUM' | 'LONG';
}

export interface HubData {
  frontSpacing?: number;
  rearSpacing?: number;
  freehubTypes: FreehubType[];
  axleType?: AxleType;
  bearingType?: string;
}

export type FreehubType = 
  | 'SHIMANO_HG'
  | 'SRAM_XD'
  | 'SRAM_XDR'
  | 'CAMPAGNOLO_N3W'
  | 'MICRO_SPLINE'
  | 'DTSWISS_350'
  | 'DTSWISS_240';

export type AxleType = 
  | 'QR_FRONT'
  | 'QR_REAR'
  | 'THRU_AXLE_12_FRONT'
  | 'THRU_AXLE_12_REAR'
  | 'THRU_AXLE_15_FRONT'
  | 'THRU_AXLE_15_REAR'
  | 'BOOST_FRONT'
  | 'BOOST_REAR';

// Calculator input parameters
export interface CalculatorParams {
  riderWeight: number; // lbs
  bikeWeight: number; // lbs
  cadence: number; // rpm
  wheelDiameter: number; // inches
  tireWidth: number; // inches
  terrain: 'road' | 'gravel' | 'trail' | 'downhill';
  tubeless: boolean;
}

// Tire pressure calculation result
export interface TirePressureResult {
  frontPSI: number;
  rearPSI: number;
  range: {
    min: number;
    max: number;
  };
  notes: string[];
  recommendations: string[];
}

// Chain length calculation result
export interface ChainLengthResult {
  links: number;
  length: number; // mm
  tolerance: {
    min: number;
    max: number;
  };
  notes: string[];
}

// Chainline analysis result
export interface ChainlineResult {
  optimalChainline: number; // mm
  currentChainline: number; // mm
  deviation: number; // mm
  efficiency: number; // percentage
  recommendations: string[];
}