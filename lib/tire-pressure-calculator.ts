// lib/tire-pressure-calculator.ts - Accurate tire pressure calculations

export interface TirePressureParams {
    riderWeight: number; // lbs
    bikeWeight: number; // lbs
    tireWidth: number; // mm
    wheelDiameter: number; // inches (700c = 28, 650b = 27.5, 26" = 26, 29" = 29)
    terrain: 'road' | 'gravel' | 'xc_trail' | 'trail' | 'enduro' | 'downhill';
    tubeless: boolean;
    conditions: 'dry' | 'wet' | 'mixed';
    priority: 'comfort' | 'balanced' | 'speed' | 'grip';
  }
  
  export interface TirePressureResult {
    frontPSI: number;
    rearPSI: number;
    range: {
      min: number;
      max: number;
    };
    terrainNotes: string[];
    setupNotes: string[];
    warnings: string[];
    recommendations: string[];
    confidence: number; // 0-100
  }
  
  export class TirePressureCalculator {
    /**
     * Calculate optimal tire pressure based on comprehensive factors
     */
    static calculateOptimalPressure(params: TirePressureParams): TirePressureResult {
      const { riderWeight, bikeWeight, tireWidth, wheelDiameter, terrain, tubeless, conditions, priority } = params;
      
      // Total system weight
      const totalWeight = riderWeight + bikeWeight;
      
      // Base pressure calculation using tire volume and weight distribution
      const baseCalculation = this.calculateBasePressure(totalWeight, tireWidth, wheelDiameter);
      
      // Apply terrain-specific adjustments
      const terrainAdjustment = this.getTerrainAdjustment(terrain, tireWidth);
      
      // Apply tubeless adjustment
      const tubelessAdjustment = tubeless ? this.getTubelessAdjustment(terrain, tireWidth) : 1.0;
      
      // Apply conditions adjustment
      const conditionsAdjustment = this.getConditionsAdjustment(conditions, terrain);
      
      // Apply priority adjustment
      const priorityAdjustment = this.getPriorityAdjustment(priority, terrain);
      
      // Calculate final pressure
      const adjustedPressure = baseCalculation.pressure * terrainAdjustment * tubelessAdjustment * conditionsAdjustment * priorityAdjustment;
      
      // Front/rear weight distribution (typically 40/60 for MTB, 45/55 for road)
      const weightDistribution = this.getWeightDistribution(terrain);
      
      const frontPSI = Math.round(adjustedPressure * weightDistribution.front);
      const rearPSI = Math.round(adjustedPressure * weightDistribution.rear);
      
      // Calculate safe range
      const range = this.calculateSafeRange(adjustedPressure, terrain, tireWidth);
      
      // Generate notes and recommendations
      const notes = this.generateNotes(params, frontPSI, rearPSI);
      
      return {
        frontPSI,
        rearPSI,
        range,
        terrainNotes: notes.terrain,
        setupNotes: notes.setup,
        warnings: notes.warnings,
        recommendations: notes.recommendations,
        confidence: this.calculateConfidence(params)
      };
    }
  
    /**
     * Calculate base pressure using tire volume and load
     */
    private static calculateBasePressure(totalWeight: number, tireWidth: number, wheelDiameter: number) {
      // Tire volume approximation (simplified torus calculation)
      const tireRadius = tireWidth / 2; // mm
      const wheelRadius = (wheelDiameter * 25.4) / 2; // convert inches to mm
      const tireVolume = Math.PI * Math.pow(tireRadius, 2) * (2 * Math.PI * (wheelRadius + tireRadius/2)); // mm³
      
      // Load per tire (assuming even distribution initially)
      const loadPerTire = (totalWeight * 0.453592) * 9.81 / 2; // Convert lbs to kg, then to Newtons, divide by 2 tires
      
      // Contact patch area estimation
      const contactPatchArea = 1500 + (tireWidth - 25) * 30; // mm² (empirical formula)
      
      // Base pressure in kPa, then convert to PSI
      const basePressureKPa = loadPerTire / (contactPatchArea / 1000000); // Convert mm² to m²
      const basePressurePSI = basePressureKPa * 0.145038; // Convert kPa to PSI
      
      return {
        pressure: basePressurePSI,
        volume: tireVolume,
        contactPatch: contactPatchArea
      };
    }
  
    /**
     * Get terrain-specific adjustment factors
     */
    private static getTerrainAdjustment(terrain: string, tireWidth: number): number {
      const adjustments = {
        road: {
          base: 1.4,
          widthFactor: (width: number) => width < 28 ? 1.5 : width < 32 ? 1.3 : 1.2
        },
        gravel: {
          base: 1.1,
          widthFactor: (width: number) => width < 35 ? 1.2 : width < 45 ? 1.1 : 1.0
        },
        xc_trail: {
          base: 0.9,
          widthFactor: (width: number) => width < 40 ? 1.0 : 0.9
        },
        trail: {
          base: 0.8,
          widthFactor: (width: number) => width < 50 ? 0.9 : 0.8
        },
        enduro: {
          base: 0.7,
          widthFactor: (width: number) => width < 60 ? 0.8 : 0.7
        },
        downhill: {
          base: 0.6,
          widthFactor: (width: number) => 0.6
        }
      };
  
      const terrainData = adjustments[terrain as keyof typeof adjustments];
      return terrainData.base * terrainData.widthFactor(tireWidth);
    }
  
    /**
     * Get tubeless-specific adjustments
     */
    private static getTubelessAdjustment(terrain: string, tireWidth: number): number {
      const tubelessReduction = {
        road: 0.92,      // 8% reduction
        gravel: 0.88,    // 12% reduction  
        xc_trail: 0.85,  // 15% reduction
        trail: 0.82,     // 18% reduction
        enduro: 0.80,    // 20% reduction
        downhill: 0.78   // 22% reduction
      };
  
      return tubelessReduction[terrain as keyof typeof tubelessReduction];
    }
  
    /**
     * Get conditions-based adjustments
     */
    private static getConditionsAdjustment(conditions: string, terrain: string): number {
      const adjustments = {
        dry: 1.0,
        wet: terrain.includes('road') ? 0.95 : 0.90, // Lower pressure for better grip
        mixed: 0.97
      };
  
      return adjustments[conditions as keyof typeof adjustments];
    }
  
    /**
     * Get priority-based adjustments
     */
    private static getPriorityAdjustment(priority: string, terrain: string): number {
      const adjustments = {
        comfort: 0.85,   // Lower pressure for comfort
        balanced: 1.0,   // Base pressure
        speed: 1.15,     // Higher pressure for speed (road/gravel only)
        grip: 0.90       // Lower pressure for grip
      };
  
      let adjustment = adjustments[priority as keyof typeof adjustments];
      
      // Speed priority doesn't apply to technical terrain
      if (priority === 'speed' && ['trail', 'enduro', 'downhill'].includes(terrain)) {
        adjustment = 1.0;
      }
  
      return adjustment;
    }
  
    /**
     * Get weight distribution between front and rear
     */
    private static getWeightDistribution(terrain: string) {
      const distributions = {
        road: { front: 0.92, rear: 1.08 },      // 45/55 split
        gravel: { front: 0.90, rear: 1.10 },    // 45/55 split
        xc_trail: { front: 0.88, rear: 1.12 },  // 44/56 split
        trail: { front: 0.85, rear: 1.15 },     // 42.5/57.5 split
        enduro: { front: 0.82, rear: 1.18 },    // 41/59 split
        downhill: { front: 0.80, rear: 1.20 }   // 40/60 split
      };
  
      return distributions[terrain as keyof typeof distributions];
    }
  
    /**
     * Calculate safe pressure range
     */
    private static calculateSafeRange(basePressure: number, terrain: string, tireWidth: number) {
      const rangePercentages = {
        road: { min: 0.85, max: 1.15 },
        gravel: { min: 0.80, max: 1.20 },
        xc_trail: { min: 0.75, max: 1.25 },
        trail: { min: 0.70, max: 1.30 },
        enduro: { min: 0.65, max: 1.35 },
        downhill: { min: 0.60, max: 1.40 }
      };
  
      const range = rangePercentages[terrain as keyof typeof rangePercentages];
      
      return {
        min: Math.round(basePressure * range.min),
        max: Math.round(basePressure * range.max)
      };
    }
  
    /**
     * Generate comprehensive notes and recommendations
     */
    private static generateNotes(params: TirePressureParams, frontPSI: number, rearPSI: number) {
      const { terrain, tireWidth, tubeless, conditions, totalWeight = params.riderWeight + params.bikeWeight } = params;
      
      const terrain_notes = [];
      const setup_notes = [];
      const warnings = [];
      const recommendations = [];
  
      // Terrain-specific notes
      switch (terrain) {
        case 'road':
          terrain_notes.push('Road riding prioritizes rolling efficiency and speed');
          terrain_notes.push('Higher pressures reduce rolling resistance on smooth surfaces');
          if (tireWidth > 32) terrain_notes.push('Wider tires allow for lower pressures while maintaining efficiency');
          break;
        case 'gravel':
          terrain_notes.push('Gravel requires balance between efficiency and traction');
          terrain_notes.push('Lower pressures improve comfort on rough surfaces');
          if (conditions === 'wet') terrain_notes.push('Wet gravel benefits from reduced pressure for better grip');
          break;
        case 'xc_trail':
        case 'trail':
          terrain_notes.push('Trail riding prioritizes traction and control');
          terrain_notes.push('Lower pressures increase contact patch for better grip');
          terrain_notes.push('Watch for pinch flats on rocky terrain');
          break;
        case 'enduro':
        case 'downhill':
          terrain_notes.push('Aggressive riding requires maximum traction and impact resistance');
          terrain_notes.push('Lower pressures provide better grip and shock absorption');
          terrain_notes.push('Higher volume tires allow for very low pressures');
          break;
      }
  
      // Setup notes
      setup_notes.push(`Total system weight: ${totalWeight}lbs`);
      setup_notes.push(`Tire width: ${tireWidth}mm`);
      if (tubeless) {
        setup_notes.push('Tubeless setup allows 8-22% lower pressure than tubed');
        setup_notes.push('Check sealant levels regularly for optimal performance');
      } else {
        setup_notes.push('Tubed setup - consider tubeless for lower pressure capability');
      }
  
      // Warnings
      if (frontPSI < 15 && !tubeless) {
        warnings.push('⚠️ Very low pressure with tubes increases pinch flat risk');
      }
      if (frontPSI > 60 && tireWidth > 50) {
        warnings.push('⚠️ High pressure in wide tires may reduce traction');
      }
      if (totalWeight > 220 && terrain !== 'road') {
        warnings.push('⚠️ Heavier riders may need slightly higher pressures');
      }
  
      // Recommendations
      recommendations.push('Start with these pressures and adjust ±2-3 PSI based on feel');
      recommendations.push('Check pressure before every ride - tires lose 1-2 PSI per week');
      if (terrain !== 'road') {
        recommendations.push('Lower pressure = more grip, higher pressure = less rolling resistance');
      }
      if (tubeless) {
        recommendations.push('Burp test: Bounce tire hard - if it burps air, increase pressure slightly');
      }
  
      return {
        terrain: terrain_notes,
        setup: setup_notes,
        warnings,
        recommendations
      };
    }
  
    /**
     * Calculate confidence score based on input validity
     */
    private static calculateConfidence(params: TirePressureParams): number {
      let confidence = 100;
      
      // Reduce confidence for extreme values
      if (params.riderWeight < 100 || params.riderWeight > 250) confidence -= 10;
      if (params.bikeWeight < 15 || params.bikeWeight > 45) confidence -= 5;
      if (params.tireWidth < 20 || params.tireWidth > 100) confidence -= 15;
      
      // Reduce confidence for less common combinations
      if (params.terrain === 'road' && params.tireWidth > 40) confidence -= 10;
      if (params.terrain === 'downhill' && params.tireWidth < 50) confidence -= 10;
      
      return Math.max(70, confidence);
    }
  
    /**
     * Get tire width recommendations for different disciplines
     */
    static getTireWidthRecommendations(terrain: string) {
      const recommendations = {
        road: {
          widths: [23, 25, 28, 30, 32],
          default: 28,
          notes: ['23-25mm: Racing', '28-30mm: Performance', '32mm+: Endurance/Comfort']
        },
        gravel: {
          widths: [32, 35, 38, 40, 42, 45],
          default: 40,
          notes: ['32-35mm: Fast gravel', '38-42mm: Mixed terrain', '45mm+: Rough gravel']
        },
        xc_trail: {
          widths: [35, 38, 40, 42, 45],
          default: 40,
          notes: ['35-38mm: XC racing', '40-42mm: Trail riding', '45mm+: Technical trails']
        },
        trail: {
          widths: [45, 50, 55, 60],
          default: 50,
          notes: ['45-50mm: Light trail', '50-55mm: All-mountain', '60mm+: Aggressive trail']
        },
        enduro: {
          widths: [55, 60, 65, 70],
          default: 60,
          notes: ['55-60mm: Racing', '60-65mm: Mixed conditions', '65mm+: Rough terrain']
        },
        downhill: {
          widths: [60, 65, 70, 75, 80],
          default: 65,
          notes: ['60-65mm: Dry conditions', '65-70mm: Mixed', '70mm+: Wet/loose conditions']
        }
      };
  
      return recommendations[terrain as keyof typeof recommendations] || recommendations.trail;
    }
  }