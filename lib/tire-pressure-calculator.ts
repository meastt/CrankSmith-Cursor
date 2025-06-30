// lib/tire-pressure-calculator.ts
// Final, complete, and untruncated version.
// Contains the corrected TirePressureCalculator and the full SuspensionCalculator and RideFeedbackWizard classes.

export interface TirePressureInput {
    riderWeight: number // kg
    bikeWeight?: number // kg (optional, defaults by bike type)
    tireWidth: number // mm
    rimInternalWidth: number // mm
    terrain: TerrainType
    ridingStyle: RidingStyle
    bikeType: BikeType
    tubeless: boolean
    temperature?: number // celsius
  }
  
  export interface TirePressureParams {
    riderWeight: number // lbs
    bikeWeight: number // lbs
    tireWidth: number // mm
    wheelDiameter: number // inches
    terrain: 'road' | 'road_rough' | 'gravel' | 'gravel_rough' | 'xc_trail' | 'trail' | 'enduro' | 'downhill'
    tubeless: boolean
    conditions: 'dry' | 'wet' | 'mixed'
    priority: 'comfort' | 'balanced' | 'speed' | 'grip'
  }
  
  export interface SuspensionInput {
    riderWeight: number // kg
    gearWeight?: number // kg
    bikeType: BikeType
    ridingStyle: RidingStyle
    terrain: TerrainType
    // NEW: Hardware-specific inputs
    forkBrand: string
    forkModel: string
    shockBrand: string
    shockModel: string
  }
  
  export interface TirePressureResult {
    frontPSI: number
    rearPSI: number
    frontBAR: number
    rearBAR: number
    confidence: number // 0-100
    range: {
      front: { min: number; max: number }
      rear: { min: number; max: number }
      min: number // For compatibility with existing page
      max: number // For compatibility with existing page
    }
    recommendations: string[]
    warnings: string[]
    terrainNotes: string[]
    setupNotes: string[]
    adjustments: {
      temperature: number // PSI change per 10°C
      altitude: number // PSI change per 1000m
    }
  }
  
  export interface SuspensionResult {
    fork: {
      pressure: number
      sagPercentage: number
      reboundClicks: number
      compressionClicks?: number
      // NEW: Specific notes
      notes: string[]
    }
    shock: {
      pressure: number
      sagPercentage: number
      reboundClicks: number
      compressionClicks?: number
      // NEW: Specific notes
      notes: string[]
    }
    recommendations: string[]
    setupNotes: string[]
  }
  
  export interface RideFeedback {
    issue: RideFeedbackType
    severity: 'mild' | 'moderate' | 'severe'
    component: 'front_tire' | 'rear_tire' | 'fork' | 'shock'
  }
  
  export interface FeedbackAdjustment {
    component: string
    currentValue: number
    suggestedValue: number
    change: number
    reasoning: string
    confidence: number
  }
  
  export type TerrainType = 
    | 'road'
    | 'road_rough' 
    | 'gravel'
    | 'gravel_rough' 
    | 'xc_trail' 
    | 'trail' 
    | 'enduro' 
    | 'downhill' 
    | 'bike_park'
  
  export type RidingStyle = 
    | 'comfort'
    | 'balanced' 
    | 'speed'
    | 'grip'
    // Legacy mapping support
    | 'casual' 
    | 'fitness' 
    | 'racing' 
    | 'aggressive' 
    | 'technical'
  
  export type BikeType = 
    | 'road' 
    | 'gravel' 
    | 'cyclocross' 
    | 'hardtail_xc' 
    | 'full_suspension_xc' 
    | 'trail' 
    | 'enduro' 
    | 'downhill' 
    | 'fat_bike'
  
  export type RideFeedbackType = 
    | 'too_harsh' 
    | 'too_soft' 
    | 'bottoming_out' 
    | 'poor_traction' 
    | 'slow_rolling' 
    | 'unstable_cornering' 
    | 'harsh_small_bumps' 
    | 'poor_pedaling_platform'
  
  export class TirePressureCalculator {
    
    static LBS_TO_KG = 0.453592;
    static PSI_TO_BAR = 0.0689476;

    static calculateOptimalPressure(params: TirePressureParams): TirePressureResult {
      const bikeType = this.mapTerrainToBikeType(params.terrain);
      const totalWeightKg = (params.riderWeight + params.bikeWeight) * this.LBS_TO_KG;

      let basePressure: number;
      if (bikeType === 'road' || bikeType === 'gravel') {
        basePressure = this.calculateRoadGravelBasePressure(totalWeightKg, params.tireWidth);
      } else {
        basePressure = this.calculateMtbBasePressure(totalWeightKg, params.tireWidth);
      }

      let pressureAdjustment = 0;
      pressureAdjustment += this.getTubelessAdjustment(params.tubeless, bikeType);
      pressureAdjustment += this.getTerrainAdjustment(params.terrain);
      pressureAdjustment += this.getPriorityAdjustment(params.priority, bikeType);
      pressureAdjustment += this.getConditionsAdjustment(params.conditions);

      const adjustedPressure = basePressure + pressureAdjustment;

      const frontRearSplit = this.getFrontRearSplit(bikeType);
      let frontPSI = adjustedPressure + frontRearSplit.front;
      let rearPSI = adjustedPressure + frontRearSplit.rear;

      const warnings: string[] = [];
      const minPressure = this.getMinimumPressure(bikeType, params.tubeless);
      const maxPressure = this.getMaximumPressure(bikeType, params.tireWidth);

      if (frontPSI < minPressure) {
        warnings.push(`Front pressure was calculated below the safe minimum (${minPressure} PSI) and has been adjusted up.`);
        frontPSI = minPressure;
      }
      if (rearPSI < minPressure) {
        warnings.push(`Rear pressure was calculated below the safe minimum (${minPressure} PSI) and has been adjusted up.`);
        rearPSI = minPressure;
      }
      if (frontPSI > maxPressure) {
        warnings.push(`Front pressure was calculated above the practical maximum (${maxPressure} PSI) and has been adjusted down.`);
        frontPSI = maxPressure;
      }
      if (rearPSI > maxPressure) {
        warnings.push(`Rear pressure was calculated above the practical maximum (${maxPressure} PSI) and has been adjusted down.`);
        rearPSI = maxPressure;
      }

      if (rearPSI < frontPSI) {
        rearPSI = frontPSI + 1;
      }
      
      const finalFrontPSI = Math.round(frontPSI);
      const finalRearPSI = Math.round(rearPSI);
      
      const input: TirePressureInput = {
        riderWeight: params.riderWeight * this.LBS_TO_KG,
        bikeWeight: params.bikeWeight * this.LBS_TO_KG,
        tireWidth: params.tireWidth,
        rimInternalWidth: this.estimateRimWidth(params.tireWidth, bikeType),
        terrain: params.terrain,
        ridingStyle: params.priority,
        bikeType: bikeType,
        tubeless: params.tubeless,
      };

      const recommendations = this.generateRecommendations(input, finalFrontPSI, finalRearPSI);
      warnings.push(...this.generateWarnings(input, finalFrontPSI, finalRearPSI));
      
      return {
        frontPSI: finalFrontPSI,
        rearPSI: finalRearPSI,
        frontBAR: parseFloat((finalFrontPSI * this.PSI_TO_BAR).toFixed(2)),
        rearBAR: parseFloat((finalRearPSI * this.PSI_TO_BAR).toFixed(2)),
        confidence: this.calculateConfidence(input),
        range: this.calculatePressureRanges(finalFrontPSI, finalRearPSI),
        recommendations,
        warnings,
        terrainNotes: this.generateTerrainNotes(input),
        setupNotes: this.generateSetupNotes(input, finalFrontPSI, finalRearPSI),
        adjustments: {
          temperature: 1.5,
          altitude: 0.5
        }
      };
    }

    private static calculateRoadGravelBasePressure(totalWeightKg: number, tireWidth: number): number {
        const basePressureFor40mm = (totalWeightKg * 0.4) + 10;
        const widthAdjustmentFactor = 1.2;
        const widthDifference = 40 - tireWidth;
        return basePressureFor40mm + (widthDifference * widthAdjustmentFactor);
    }

    private static calculateMtbBasePressure(totalWeightKg: number, tireWidth: number): number {
        const basePressureFor61mm = (totalWeightKg * 0.2) + 6;
        const widthAdjustmentFactor = 0.5;
        const widthDifference = 61 - tireWidth;
        return basePressureFor61mm + (widthDifference * widthAdjustmentFactor);
    }
    
    private static getFrontRearSplit(bikeType: BikeType): { front: number; rear: number } {
        if (bikeType === 'road') {
            return { front: -2, rear: +2 };
        }
        return { front: -1.5, rear: +1.5 };
    }

    private static getTubelessAdjustment(tubeless: boolean, bikeType: BikeType): number {
        if (!tubeless) return 0;
        if (bikeType === 'road') return -6;
        if (bikeType === 'gravel') return -4;
        return -3;
    }

    private static getTerrainAdjustment(terrain: TerrainType): number {
        const adjustments: Partial<Record<TerrainType, number>> = {
            road: 0, road_rough: -5,
            gravel: 0, gravel_rough: -3,
            xc_trail: 1, trail: 0,
            enduro: -2, downhill: -4,
        };
        return adjustments[terrain] ?? 0;
    }

    private static getPriorityAdjustment(priority: RidingStyle, bikeType: BikeType): number {
        const forSpeed = (bikeType === 'road') ? 4 : 2;
        const forGrip = (bikeType === 'enduro' || bikeType === 'downhill') ? -3 : -2;
        const adjustments: Record<string, number> = {
            speed: forSpeed, balanced: 0,
            comfort: -2, grip: forGrip,
        };
        const legacyMapping: Record<string, string> = { 'racing': 'speed', 'fitness': 'balanced', 'casual': 'comfort', 'technical': 'grip' };
        const mappedPriority = legacyMapping[priority] || priority;
        return adjustments[mappedPriority] ?? 0;
    }
    
    private static getConditionsAdjustment(conditions: 'dry' | 'wet' | 'mixed'): number {
        if (conditions === 'wet') return -2;
        if (conditions === 'mixed') return -1;
        return 0;
    }

    private static mapTerrainToBikeType(terrain: string): BikeType {
      const mapping: Record<string, BikeType> = {
        'road': 'road', 'road_rough': 'road',
        'gravel': 'gravel', 'gravel_rough': 'gravel',
        'xc_trail': 'full_suspension_xc', 'trail': 'trail',
        'enduro': 'enduro', 'downhill': 'downhill'
      };
      return mapping[terrain] || 'trail';
    }

    private static estimateRimWidth(tireWidth: number, bikeType: BikeType): number {
      if (bikeType === 'road') return tireWidth < 30 ? 19 : 21;
      if (bikeType === 'gravel') return tireWidth < 45 ? 23 : 25;
      if (tireWidth < 60) return 27;
      return 30;
    }

    private static calculateConfidence(input: TirePressureInput): number {
        let confidence = 95;
        if (input.riderWeight < 50 || input.riderWeight > 120) confidence -= 5;
        if (input.bikeType === 'road' && (input.tireWidth < 23 || input.tireWidth > 35)) confidence -= 5;
        if (input.bikeType === 'gravel' && (input.tireWidth < 35 || input.tireWidth > 55)) confidence -= 5;
        if (input.bikeType.includes('xc') || input.bikeType.includes('trail') || input.bikeType.includes('enduro')) {
            if (input.tireWidth < 50 || input.tireWidth > 75) confidence -= 10;
        }
        return Math.min(Math.max(confidence, 70), 95);
    }
    
    private static getMinimumPressure(bikeType: BikeType, tubeless: boolean): number {
      const tubePenalty = tubeless ? 0 : 4;
      const minimums: Record<BikeType, number> = {
        road: 50, gravel: 25, cyclocross: 22, hardtail_xc: 20,
        full_suspension_xc: 19, trail: 18, enduro: 17,
        downhill: 16, fat_bike: 5
      };
      return (minimums[bikeType] || 20) + tubePenalty;
    }

    private static getMaximumPressure(bikeType: BikeType, tireWidth: number): number {
      const maximums: Record<BikeType, number> = {
        road: 110, gravel: 55, cyclocross: 50, hardtail_xc: 40,
        full_suspension_xc: 40, trail: 38, enduro: 35,
        downhill: 35, fat_bike: 15
      };
      return maximums[bikeType] || 40;
    }

    private static calculatePressureRanges(frontPSI: number, rearPSI: number): TirePressureResult['range'] {
      const variation = 2;
      const frontMin = frontPSI - variation;
      const rearMin = rearPSI - variation;
      return {
        front: { min: frontMin, max: frontPSI + variation },
        rear: { min: rearMin, max: rearPSI + variation },
        min: Math.min(frontMin, rearMin),
        max: Math.max(frontPSI + variation, rearPSI + variation)
      };
    }

    private static generateRecommendations(input: TirePressureInput, frontPSI: number, rearPSI: number ): string[] {
        const recommendations: string[] = [];
        recommendations.push('Start with these pressures and adjust by 1-2 PSI based on feel. Your personal preference is key.');
        if (!input.tubeless && input.bikeType !== 'road') {
          recommendations.push('Consider a tubeless setup. It allows lower pressures for more grip and comfort, and prevents most punctures.');
        }
        if ((input.bikeType === 'enduro' || input.bikeType === 'downhill' || input.ridingStyle === 'grip') && rearPSI < 25) {
            recommendations.push('For aggressive riding on rocky terrain, consider using tire inserts to protect your rims at these lower pressures.');
        }
        recommendations.push('Use a quality digital pressure gauge. The gauges on floor pumps can be inaccurate, especially at lower MTB/Gravel pressures.');
        return recommendations;
    }
  
    private static generateWarnings(input: TirePressureInput, frontPSI: number, rearPSI: number ): string[] {
        const warnings: string[] = [];
        if (!input.tubeless && (frontPSI < 30 || rearPSI < 30) && input.bikeType !== 'fat_bike') {
            warnings.push('Running tubes at this low pressure significantly increases the risk of "pinch flat" punctures. Be cautious on sharp impacts.');
        }
        const rimToTireRatio = input.rimInternalWidth / input.tireWidth;
        if (rimToTireRatio > 0.7) {
            warnings.push(`Your tires may be narrow for your rims. Verify manufacturer compatibility to ensure bead safety.`);
        }
        return warnings;
    }

    private static generateTerrainNotes(input: TirePressureInput): string[] {
        const notes: string[] = [];
        switch (input.terrain) {
            case 'road': case 'road_rough':
                notes.push('For road, the goal is minimizing rolling resistance without a harsh ride. Wider tires at lower pressures are often faster on real-world pavement.');
                break;
            case 'gravel': case 'gravel_rough':
                notes.push('Gravel pressure is a crucial trade-off between speed and control. Erring on the lower side usually improves comfort and grip on unpredictable surfaces.');
                break;
            case 'xc_trail':
                notes.push('XC setups prioritize rolling efficiency. The calculated pressure aims to be firm enough for fast pedaling while still absorbing trail chatter.');
                break;
            case 'trail': case 'enduro':
                notes.push('For trail/enduro, pressure is key for traction. The lower front pressure helps the tire conform to the ground for steering grip, while the higher rear pressure supports your weight and prevents flats.');
                break;
            case 'downhill':
                notes.push('Downhill settings are all about maximizing grip and damping. These pressures are typically paired with reinforced tire casings and/or inserts to prevent rim damage.');
                break;
        }
        return notes;
    }

    private static generateSetupNotes(input: TirePressureInput, frontPSI: number, rearPSI: number): string[] {
        const notes: string[] = [];
        notes.push(`A ${Math.round(frontPSI)} PSI front / ${Math.round(rearPSI)} PSI rear pressure is recommended for your ${input.tireWidth}mm tires.`);
        if (input.tubeless) {
            notes.push('Your tubeless setup allows for lower pressures, increasing grip and comfort. Remember to refresh your sealant every 3-6 months.');
        } else {
            notes.push('With inner tubes, be cautious at the lower end of your pressure range to avoid pinch flats, especially on the rear wheel.');
        }
        if (input.riderWeight > 100) {
            notes.push('As a heavier rider, ensuring adequate rear tire pressure is critical to prevent bottoming out the tire on the rim.');
        }
        return notes;
    }

    static adjustPressureFromFeedback(
        currentFrontPSI: number,
        currentRearPSI: number,
        feedback: RideFeedback[]
      ): FeedbackAdjustment[] {
        const adjustments: FeedbackAdjustment[] = []
    
        feedback.forEach(fb => {
          const { issue, severity, component } = fb
          let adjustment = 0
          let reasoning = ''
    
          const severityMultiplier = {
            mild: 1,
            moderate: 2,
            severe: 3
          }[severity]
    
          switch (issue) {
            case 'too_harsh':
              adjustment = -1.5 * severityMultiplier
              reasoning = 'Reduce pressure for better comfort and small bump compliance'
              break
            case 'too_soft':
              adjustment = 1.5 * severityMultiplier
              reasoning = 'Increase pressure for better support and efficiency'
              break
            case 'bottoming_out':
              adjustment = 2.5 * severityMultiplier
              reasoning = 'Increase pressure to prevent rim strikes and damage'
              break
            case 'poor_traction':
              adjustment = -1.5 * severityMultiplier
              reasoning = 'Reduce pressure to increase contact patch and grip'
              break
            case 'slow_rolling':
              adjustment = 1.5 * severityMultiplier
              reasoning = 'Increase pressure to reduce rolling resistance'
              break
            case 'unstable_cornering':
              adjustment = 1 * severityMultiplier
              reasoning = 'Increase pressure for better cornering stability'
              break
            case 'harsh_small_bumps':
              adjustment = -2 * severityMultiplier
              reasoning = 'Reduce pressure for better small bump sensitivity'
              break
          }
    
          const currentPSI = component.includes('front') ? currentFrontPSI : currentRearPSI
          const suggestedPSI = Math.round(currentPSI + adjustment)
    
          adjustments.push({
            component: component.replace('_', ' '),
            currentValue: currentPSI,
            suggestedValue: suggestedPSI,
            change: adjustment,
            reasoning,
            confidence: 85 - Math.abs(adjustment) * 2 // Lower confidence for bigger changes
          })
        })
    
        return adjustments
    }
  }

const SUSPENSION_PROFILES: Record<string, Record<string, any>> = {
    'RockShox': {
        'Lyrik/Pike/ZEB (Charger 3)': { pressureMultiplier: 1.0, reboundTotal: 20, compressionTotal: 16, notes: ["Charger 3 dampers have independent High/Low Speed Compression. Start with both centered.", "Rebound is set from fully closed. Your dial should be usable throughout its range."] },
        'SID (Charger Race Day)': { pressureMultiplier: 1.05, reboundTotal: 20, compressionTotal: 2, notes: ["The 2-position compression is for 'Open' or 'Lock'. Most riding is done in Open.", "Consider adding a volume spacer if you bottom out frequently on big hits."] },
        'Generic': { pressureMultiplier: 1.0, reboundTotal: 20, compressionTotal: 10, notes: [] }
    },
    'Fox': {
        '36/38 (GRIP2)': { pressureMultiplier: 1.05, reboundTotal: 16, compressionTotal: 16, notes: ["GRIP2 dampers have independent HSC/LSC and HSR/LSR. Start with Fox's recommendations and tune one click at a time.", "Fox forks often require slightly more pressure for the same sag percentage."] },
        '34 (FIT4)': { pressureMultiplier: 1.0, reboundTotal: 18, compressionTotal: 3, notes: ["The 3-position switch (Open, Medium, Firm) is your primary compression adjustment.", "In 'Open' mode, you have additional low-speed compression fine-tuning."] },
        'Float X / DPX2': { pressureMultiplier: 1.0, reboundTotal: 14, compressionTotal: 3, notes: ["Ensure you equalize the positive/negative air chambers by cycling the shock during setup.", "Rebound is the most critical setting to get right for traction."] },
        'Float X2': { pressureMultiplier: 1.1, reboundTotal: 16, compressionTotal: 16, notes: ["Like GRIP2, the X2 has independent high and low speed adjustments. Start in the middle and tune from there.", "Requires precise setup but offers the highest level of tunability."] },
        'Generic': { pressureMultiplier: 1.05, reboundTotal: 18, compressionTotal: 10, notes: [] }
    },
    'Other': {
        'Generic': { pressureMultiplier: 1.0, reboundTotal: 20, compressionTotal: 10, notes: ["These are generic baseline settings. Your manufacturer's guide is the best source for specific tuning advice."] }
    }
};
  
  export class SuspensionCalculator {
    
    private static getSuspensionProfile(brand: string, model: string) {
        return SUSPENSION_PROFILES[brand]?.[model] || SUSPENSION_PROFILES[brand]?.['Generic'] || SUSPENSION_PROFILES['Other']['Generic'];
    }

    static calculateSuspensionSettings(input: SuspensionInput): SuspensionResult {
      const {
        riderWeight, gearWeight = 5, bikeType, ridingStyle, terrain,
        forkBrand, forkModel, shockBrand, shockModel
      } = input
  
      const totalWeight = riderWeight + gearWeight;
      const forkProfile = this.getSuspensionProfile(forkBrand, forkModel);
      const shockProfile = this.getSuspensionProfile(shockBrand, shockModel);

      const forkSettings = this.calculateForkSettings(totalWeight, bikeType, ridingStyle, forkProfile);
      const shockSettings = this.calculateShockSettings(totalWeight, bikeType, ridingStyle, shockProfile);
      
      const recommendations = this.generateSuspensionRecommendations();
      const setupNotes = this.generateSetupNotes();
  
      return { fork: forkSettings, shock: shockSettings, recommendations, setupNotes }
    }
  
    private static calculateForkSettings(totalWeight: number, bikeType: BikeType, ridingStyle: RidingStyle, profile: any) {
      // Base pressure calculation (PSI per kg of rider weight)
      let pressure = totalWeight * (bikeType.includes('enduro') || bikeType.includes('downhill') ? 2.0 : 1.9);
      // Apply model-specific multiplier
      pressure *= profile.pressureMultiplier;

      // Style adjustment
      if(ridingStyle === 'speed') pressure += 5;
      if(ridingStyle === 'comfort') pressure -= 5;
  
      const targetSag = this.getTargetSag(bikeType, 'fork');
      
      // Rebound: target a percentage of the total range. Slower for aggressive, faster for comfort.
      let reboundRatio = 0.4; // 40% from fully closed (slow) is a good balanced start
      if(ridingStyle === 'speed') reboundRatio = 0.3; // Slower rebound
      if(ridingStyle === 'comfort') reboundRatio = 0.5; // Faster rebound
      const reboundClicks = Math.round(profile.reboundTotal * reboundRatio);

      return {
        pressure: Math.round(pressure),
        sagPercentage: targetSag,
        reboundClicks: reboundClicks,
        notes: profile.notes,
      }
    }
  
    private static calculateShockSettings(totalWeight: number, bikeType: BikeType, ridingStyle: RidingStyle, profile: any) {
        if (bikeType === 'hardtail_xc') return { pressure: 0, sagPercentage: 0, reboundClicks: 0, notes: [] };

        let pressure = totalWeight * 2.5; // Start with a more generic base pressure for shocks
        pressure *= profile.pressureMultiplier;

        if(ridingStyle === 'speed') pressure += 10;
        if(ridingStyle === 'comfort') pressure -= 10;

        const targetSag = this.getTargetSag(bikeType, 'shock');
        
        let reboundRatio = 0.45;
        if(ridingStyle === 'speed') reboundRatio = 0.35;
        if(ridingStyle === 'comfort') reboundRatio = 0.55;
        const reboundClicks = Math.round(profile.reboundTotal * reboundRatio);

        return {
            pressure: Math.round(pressure),
            sagPercentage: targetSag,
            reboundClicks: reboundClicks,
            notes: profile.notes,
        }
    }
  
    private static getTargetSag(bikeType: BikeType, component: 'fork' | 'shock'): number {
      const sagTargets: Partial<Record<BikeType, { fork: number; shock: number }>> = {
        full_suspension_xc: { fork: 20, shock: 25 },
        trail: { fork: 25, shock: 30 },
        enduro: { fork: 25, shock: 30 },
        downhill: { fork: 30, shock: 35 },
        hardtail_xc: { fork: 20, shock: 0 }
      };
      return sagTargets[bikeType]?.[component] || 0;
    }
  
    private static generateSuspensionRecommendations(): string[] {
        return [
            "Set sag first with all your riding gear on. This is the most critical step.",
            "Cycle the suspension several times when adding air to equalize positive and negative chambers.",
            "Our rebound setting is a starting point. A good test: push down hard and see how it returns. It should be controlled, not springy.",
            "Bracket your settings: Ride a familiar trail, then try adding/removing 2 PSI or 1 click of rebound to feel the difference."
        ];
    }
  
    private static generateSetupNotes(): string[] {
        return [
            "Always use a dedicated, high-quality shock pump for accurate pressure readings.",
            "Record your final settings! Keep a log in your phone or notebook for different trail types."
        ];
    }
  }
  
  export class RideFeedbackWizard {
    static getTirePressureQuestions(): any[] {
        return [{ id: 'ride_feel', question: 'How does your bike feel on typical terrain?', options: [{ value: 'too_harsh', label: 'Too harsh/jarring' }, { value: 'too_soft', label: 'Too soft/squishy' }, { value: 'poor_traction', label: 'Poor traction' }] }];
    }
  
    static getSuspensionQuestions(): any[] {
        return [{ id: 'fork_feel', question: 'How does your front suspension feel?', component: 'fork', options: [{ value: 'too_harsh', label: 'Too harsh' }, { value: 'too_soft', label: 'Too soft/divey' }, { value: 'bottoming_out', label: 'Bottoming out' }] }];
    }
  
    static processRideFeedback(currentSettings: any, feedback: any[]): FeedbackAdjustment[] {
        const adjustments: FeedbackAdjustment[] = [];
        feedback.forEach(item => {
            if (item.component?.includes('tire')) {
                const tireAdjustments = TirePressureCalculator.adjustPressureFromFeedback(currentSettings.frontTirePSI, currentSettings.rearTirePSI, item.selectedOptions.map((o: any) => ({ issue: o, severity: item.severity, component: item.component })));
                adjustments.push(...tireAdjustments);
            }
        });
        return adjustments;
    }
  }
  
  export const calculateTirePressure = TirePressureCalculator.calculateOptimalPressure;
  export const calculateSuspension = SuspensionCalculator.calculateSuspensionSettings;
  export const adjustFromFeedback = TirePressureCalculator.adjustPressureFromFeedback;
  export const getFeedbackQuestions = RideFeedbackWizard.getTirePressureQuestions;