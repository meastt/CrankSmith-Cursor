// lib/tire-pressure-calculator.ts

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
  
  // Interface to match the page's simpler parameter structure
  export interface TirePressureParams {
    riderWeight: number // lbs
    bikeWeight: number // lbs
    tireWidth: number // mm
    wheelDiameter: number // inches
    terrain: 'road' | 'gravel' | 'xc_trail' | 'trail' | 'enduro' | 'downhill'
    tubeless: boolean
    conditions: 'dry' | 'wet' | 'mixed'
    priority: 'comfort' | 'balanced' | 'speed' | 'grip'
  }
  
  export interface SuspensionInput {
    riderWeight: number // kg
    gearWeight?: number // kg
    forkModel?: string
    shockModel?: string
    bikeType: BikeType
    ridingStyle: RidingStyle
    terrain: TerrainType
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
    terrainNotes: string[] // Added for page compatibility
    setupNotes: string[] // Added for page compatibility
    adjustments: {
      temperature: number // PSI change per 10°C
      altitude: number // PSI change per 1000m
    }
  }
  
  export interface SuspensionResult {
    fork: {
      pressure: number // PSI
      sag: number // mm
      sagPercentage: number // %
      reboundClicks: number
      compressionClicks?: number
    }
    shock: {
      pressure: number // PSI
      sag: number // mm
      sagPercentage: number // %
      reboundClicks: number
      compressionClicks?: number
      leverageRatio?: number
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
    | 'road_smooth' 
    | 'road_rough' 
    | 'gravel_smooth' 
    | 'gravel_rough' 
    | 'xc_trail' 
    | 'trail' 
    | 'enduro' 
    | 'downhill' 
    | 'bike_park'
  
  export type RidingStyle = 
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
    
    /**
     * Calculate optimal tire pressure using Silca-style methodology
     * This version accepts TirePressureParams from the page
     */
    static calculateOptimalPressure(params: TirePressureParams): TirePressureResult {
      // Convert page params to internal format
      const input: TirePressureInput = {
        riderWeight: params.riderWeight * 0.453592, // lbs to kg
        bikeWeight: params.bikeWeight * 0.453592, // lbs to kg
        tireWidth: params.tireWidth,
        rimInternalWidth: this.estimateRimWidth(params.tireWidth), // Estimate rim width
        terrain: this.mapTerrain(params.terrain),
        ridingStyle: this.mapPriority(params.priority),
        bikeType: this.mapTerrainToBikeType(params.terrain),
        tubeless: params.tubeless,
        temperature: 20 // Default temperature
      }
  
      return this.calculateOptimalPressureAdvanced(input)
    }
  
    /**
     * Advanced calculation using the full TirePressureInput interface
     */
    static calculateOptimalPressureAdvanced(input: TirePressureInput): TirePressureResult {
      const {
        riderWeight,
        bikeWeight = this.getDefaultBikeWeight(input.bikeType),
        tireWidth,
        rimInternalWidth,
        terrain,
        ridingStyle,
        bikeType,
        tubeless,
        temperature = 20
      } = input
  
      // Total system weight
      const totalWeight = riderWeight + bikeWeight
  
      // Base pressure calculation (similar to Silca methodology)
      const basePressure = this.calculateBasePressure(
        totalWeight,
        tireWidth,
        rimInternalWidth,
        bikeType
      )
  
      // Terrain adjustments
      const terrainMultiplier = this.getTerrainMultiplier(terrain, bikeType)
      
      // Riding style adjustments
      const styleMultiplier = this.getRidingStyleMultiplier(ridingStyle, bikeType)
      
      // Tubeless adjustment
      const tubelessAdjustment = tubeless ? -0.15 : 0 // 15% reduction for tubeless
      
      // Calculate front/rear distribution
      const { frontRatio, rearRatio } = this.getWeightDistribution(bikeType, ridingStyle)
      
      // Apply all adjustments
      let frontPressure = basePressure * frontRatio * terrainMultiplier * styleMultiplier
      let rearPressure = basePressure * rearRatio * terrainMultiplier * styleMultiplier
      
      // Apply tubeless adjustment
      frontPressure *= (1 + tubelessAdjustment)
      rearPressure *= (1 + tubelessAdjustment)
      
      // Temperature adjustment
      const tempAdjustment = this.getTemperatureAdjustment(temperature)
      frontPressure += tempAdjustment
      rearPressure += tempAdjustment
      
      // Round to reasonable precision
      frontPressure = Math.round(frontPressure * 2) / 2 // Round to 0.5 PSI
      rearPressure = Math.round(rearPressure * 2) / 2
      
      // Calculate confidence based on input quality
      const confidence = this.calculateConfidence(input)
      
      // Generate recommendations and warnings
      const recommendations = this.generateRecommendations(input, frontPressure, rearPressure)
      const warnings = this.generateWarnings(input, frontPressure, rearPressure)
      
      // Calculate ranges
      const range = this.calculatePressureRanges(frontPressure, rearPressure, terrain, ridingStyle)
      
      // Generate terrain and setup notes
      const terrainNotes = this.generateTerrainNotes(input)
      const setupNotes = this.generateSetupNotes(input)
      
      return {
        frontPSI: frontPressure,
        rearPSI: rearPressure,
        frontBAR: Math.round(frontPressure * 0.0689476 * 100) / 100,
        rearBAR: Math.round(rearPressure * 0.0689476 * 100) / 100,
        confidence,
        range: {
          front: range.front,
          rear: range.rear,
          min: Math.min(range.front.min, range.rear.min), // Compatibility
          max: Math.max(range.front.max, range.rear.max)  // Compatibility
        },
        recommendations,
        warnings,
        terrainNotes,
        setupNotes,
        adjustments: {
          temperature: 1.5, // PSI per 10°C
          altitude: 0.5 // PSI per 1000m
        }
      }
    }
  
    /**
     * Calculate base pressure using advanced methodology
     */
    private static calculateBasePressure(
      totalWeight: number,
      tireWidth: number,
      rimInternalWidth: number,
      bikeType: BikeType
    ): number {
      // Convert to imperial for calculation consistency
      const weightLbs = totalWeight * 2.20462
      const tireWidthInch = tireWidth / 25.4
      const rimWidthInch = rimInternalWidth / 25.4
      
      // Tire volume approximation
      const tireVolume = this.calculateTireVolume(tireWidthInch, rimWidthInch)
      
      // Base formula: weight-to-pressure ratio adjusted for tire volume
      let basePressure: number
      
      switch (bikeType) {
        case 'road':
          basePressure = (weightLbs * 0.9) / tireVolume
          break
        case 'gravel':
        case 'cyclocross':
          basePressure = (weightLbs * 0.7) / tireVolume
          break
        case 'hardtail_xc':
        case 'full_suspension_xc':
          basePressure = (weightLbs * 0.5) / tireVolume
          break
        case 'trail':
        case 'enduro':
          basePressure = (weightLbs * 0.4) / tireVolume
          break
        case 'downhill':
          basePressure = (weightLbs * 0.35) / tireVolume
          break
        case 'fat_bike':
          basePressure = (weightLbs * 0.15) / tireVolume
          break
        default:
          basePressure = (weightLbs * 0.6) / tireVolume
      }
      
      return Math.max(basePressure, this.getMinimumPressure(bikeType))
    }
  
    /**
     * Calculate approximate tire volume
     */
    private static calculateTireVolume(tireWidthInch: number, rimWidthInch: number): number {
      // Simplified tire volume calculation
      const effectiveWidth = tireWidthInch * 0.85 // Account for rim interface
      const height = effectiveWidth * 0.6 // Approximate tire height
      return effectiveWidth * height * 0.785 // Approximate elliptical cross-section
    }
  
    /**
     * Get terrain-specific pressure multipliers
     */
    private static getTerrainMultiplier(terrain: TerrainType, bikeType: BikeType): number {
      const multipliers: Record<TerrainType, number> = {
        road_smooth: 1.1,
        road_rough: 0.95,
        gravel_smooth: 0.9,
        gravel_rough: 0.8,
        xc_trail: 0.85,
        trail: 0.8,
        enduro: 0.75,
        downhill: 0.7,
        bike_park: 0.65
      }
      
      return multipliers[terrain] || 0.9
    }
  
    /**
     * Get riding style multipliers
     */
    private static getRidingStyleMultiplier(style: RidingStyle, bikeType: BikeType): number {
      const multipliers: Record<RidingStyle, number> = {
        casual: 0.9,
        fitness: 1.0,
        racing: 1.1,
        aggressive: 0.85,
        technical: 0.8
      }
      
      return multipliers[style] || 1.0
    }
  
    /**
     * Get weight distribution between front and rear
     */
    private static getWeightDistribution(bikeType: BikeType, ridingStyle: RidingStyle): { frontRatio: number; rearRatio: number } {
      const distributions: Record<BikeType, { front: number; rear: number }> = {
        road: { front: 0.4, rear: 0.6 },
        gravel: { front: 0.42, rear: 0.58 },
        cyclocross: { front: 0.45, rear: 0.55 },
        hardtail_xc: { front: 0.4, rear: 0.6 },
        full_suspension_xc: { front: 0.38, rear: 0.62 },
        trail: { front: 0.35, rear: 0.65 },
        enduro: { front: 0.32, rear: 0.68 },
        downhill: { front: 0.3, rear: 0.7 },
        fat_bike: { front: 0.4, rear: 0.6 }
      }
      
      const base = distributions[bikeType] || distributions.trail
      
      // Adjust for riding style
      let frontAdjustment = 0
      if (ridingStyle === 'aggressive' || ridingStyle === 'technical') {
        frontAdjustment = -0.02 // Slightly more rear bias for stability
      } else if (ridingStyle === 'racing') {
        frontAdjustment = 0.01 // Slightly more front for responsiveness
      }
      
      return {
        frontRatio: base.front + frontAdjustment,
        rearRatio: base.rear - frontAdjustment
      }
    }
  
    /**
     * Get temperature adjustment
     */
    private static getTemperatureAdjustment(temperature: number): number {
      const referencTemp = 20 // 20°C reference
      const tempDiff = temperature - referencTemp
      return tempDiff * 0.15 // 0.15 PSI per degree C
    }
  
    /**
     * Calculate confidence score
     */
    private static calculateConfidence(input: TirePressureInput): number {
      let confidence = 85 // Base confidence
      
      // Reduce confidence for extreme values
      if (input.riderWeight < 50 || input.riderWeight > 120) confidence -= 10
      if (input.tireWidth < 23 || input.tireWidth > 65) confidence -= 5
      if (input.rimInternalWidth < 15 || input.rimInternalWidth > 35) confidence -= 5
      
      // Increase confidence for common combinations
      if (input.bikeType === 'road' && input.tireWidth >= 25 && input.tireWidth <= 32) confidence += 5
      if (input.bikeType === 'gravel' && input.tireWidth >= 35 && input.tireWidth <= 45) confidence += 5
      if (input.bikeType.includes('trail') && input.tireWidth >= 55 && input.tireWidth <= 65) confidence += 5
      
      return Math.min(Math.max(confidence, 50), 95)
    }
  
    /**
     * Helper function to map simple terrain strings to TerrainType
     */
    private static mapTerrain(terrain: string): TerrainType {
      const mapping: Record<string, TerrainType> = {
        'road': 'road_smooth',
        'gravel': 'gravel_smooth', 
        'xc_trail': 'xc_trail',
        'trail': 'trail',
        'enduro': 'enduro',
        'downhill': 'downhill'
      }
      return mapping[terrain] || 'trail'
    }
  
    /**
     * Helper function to map priority to riding style
     */
    private static mapPriority(priority: string): RidingStyle {
      const mapping: Record<string, RidingStyle> = {
        'comfort': 'casual',
        'balanced': 'fitness',
        'speed': 'racing',
        'grip': 'technical'
      }
      return mapping[priority] || 'fitness'
    }
  
    /**
     * Helper function to map terrain to bike type
     */
    private static mapTerrainToBikeType(terrain: string): BikeType {
      const mapping: Record<string, BikeType> = {
        'road': 'road',
        'gravel': 'gravel',
        'xc_trail': 'hardtail_xc',
        'trail': 'trail',
        'enduro': 'enduro',
        'downhill': 'downhill'
      }
      return mapping[terrain] || 'trail'
    }
  
    /**
     * Estimate rim internal width based on tire width
     */
    private static estimateRimWidth(tireWidth: number): number {
      // Common rim-to-tire ratios
      if (tireWidth <= 28) return 19 // Road
      if (tireWidth <= 40) return 21 // Gravel
      if (tireWidth <= 50) return 25 // XC
      if (tireWidth <= 65) return 30 // Trail
      return 35 // Enduro/DH
    }
  
    /**
     * Generate terrain-specific notes
     */
    private static generateTerrainNotes(input: TirePressureInput): string[] {
      const notes: string[] = []
      
      switch (input.terrain) {
        case 'road_smooth':
        case 'road_rough':
          notes.push('Road riding prioritizes rolling efficiency and speed')
          notes.push('Higher pressures reduce rolling resistance on smooth surfaces')
          if (input.tireWidth > 32) {
            notes.push('Wider tires allow for lower pressures while maintaining efficiency')
          }
          break
          
        case 'gravel_smooth':
        case 'gravel_rough':
          notes.push('Gravel requires balance between efficiency and traction')
          notes.push('Lower pressures improve comfort on rough surfaces')
          notes.push('Consider tubeless for better puncture resistance')
          break
          
        case 'xc_trail':
          notes.push('XC riding balances efficiency with traction needs')
          notes.push('Higher pressures for smooth climbs, lower for technical sections')
          notes.push('Adjust based on trail conditions and racing vs training')
          break
          
        case 'trail':
          notes.push('Trail riding prioritizes traction and control')
          notes.push('Lower pressures increase contact patch for better grip')
          notes.push('Watch for pinch flats on rocky terrain')
          break
          
        case 'enduro':
          notes.push('Enduro demands maximum traction on descents')
          notes.push('Lower pressures improve impact absorption')
          notes.push('Consider volume spacers for rim protection')
          break
          
        case 'downhill':
        case 'bike_park':
          notes.push('Downhill prioritizes maximum traction and impact resistance')
          notes.push('Very low pressures for grip, but watch for rim strikes')
          notes.push('Heavy-duty tires and rim protection recommended')
          break
      }
      
      // Add tubeless-specific notes
      if (input.tubeless) {
        notes.push('Tubeless setup allows 10-15% lower pressures safely')
        notes.push('Regular sealant maintenance improves puncture resistance')
      }
      
      return notes
    }
  
    /**
     * Generate setup-specific notes
     */
    private static generateSetupNotes(input: TirePressureInput): string[] {
      const notes: string[] = []
      
      // General setup notes
      notes.push('Check pressure before every ride - tires lose 1-2 PSI per week')
      notes.push('Use a quality floor pump with accurate gauge')
      notes.push('Measure pressure when tires are cold for consistency')
      
      // Weight-specific notes
      if (input.riderWeight < 60) {
        notes.push('Lighter riders can run lower pressures safely')
      } else if (input.riderWeight > 90) {
        notes.push('Heavier riders may need higher pressures to prevent pinch flats')
      }
      
      // Tire width specific notes
      if (input.tireWidth > 50) {
        notes.push('Wide tires provide more air volume for comfort at lower pressures')
      } else if (input.tireWidth < 30) {
        notes.push('Narrow tires require higher pressures for proper support')
      }
      
      // Rim compatibility notes
      const rimToTireRatio = input.rimInternalWidth / input.tireWidth
      if (rimToTireRatio < 0.5) {
        notes.push('Tire may be too wide for rim - check manufacturer compatibility')
      } else if (rimToTireRatio > 0.8) {
        notes.push('Tire may be too narrow for rim - consider wider tire')
      }
      
      // Riding style notes
      if (input.ridingStyle === 'racing') {
        notes.push('Racing setup: Start with calculated pressure, fine-tune for conditions')
      } else if (input.ridingStyle === 'casual') {
        notes.push('Comfort focus: Err on the lower side within safe range')
      }
      
      return notes
    }
  
    /**
     * Generate recommendations
     */
    private static generateRecommendations(
      input: TirePressureInput, 
      frontPSI: number, 
      rearPSI: number
    ): string[] {
      const recommendations: string[] = []
      
      // Tubeless recommendations
      if (!input.tubeless && input.bikeType !== 'road') {
        recommendations.push('Consider tubeless setup for lower pressures and better traction')
      }
      
      // Tire width recommendations
      if (input.bikeType === 'gravel' && input.tireWidth < 35) {
        recommendations.push('Consider wider tires (38-42mm) for better comfort and traction')
      }
      
      // Pressure testing recommendations
      recommendations.push('Start with these pressures and adjust ±2 PSI based on feel')
      recommendations.push('Check pressure before every ride - tires lose 1-2 PSI per week')
      
      // Rim width recommendations
      const rimToTireRatio = input.rimInternalWidth / input.tireWidth
      if (rimToTireRatio < 0.5 || rimToTireRatio > 0.8) {
        recommendations.push('Rim/tire width ratio is outside optimal range - consider different tire or rim width')
      }
      
      return recommendations
    }
  
    /**
     * Generate warnings
     */
    private static generateWarnings(
      input: TirePressureInput, 
      frontPSI: number, 
      rearPSI: number
    ): string[] {
      const warnings: string[] = []
      
      // Pressure range warnings
      const minSafe = this.getMinimumPressure(input.bikeType)
      const maxSafe = this.getMaximumPressure(input.bikeType, input.tireWidth)
      
      if (frontPSI < minSafe || rearPSI < minSafe) {
        warnings.push(`Calculated pressure below minimum safe pressure (${minSafe} PSI)`)
      }
      
      if (frontPSI > maxSafe || rearPSI > maxSafe) {
        warnings.push(`Calculated pressure above maximum recommended pressure (${maxSafe} PSI)`)
      }
      
      // Rim compatibility warnings
      if (input.rimInternalWidth > input.tireWidth * 0.8) {
        warnings.push('Rim may be too wide for tire - check manufacturer compatibility charts')
      }
      
      return warnings
    }
  
    /**
     * Calculate pressure ranges for fine-tuning
     */
    private static calculatePressureRanges(
      frontPSI: number, 
      rearPSI: number, 
      terrain: TerrainType, 
      ridingStyle: RidingStyle
    ): TirePressureResult['range'] {
      const variation = terrain.includes('rough') || ridingStyle === 'technical' ? 4 : 3
      
      return {
        front: {
          min: Math.max(frontPSI - variation, 15),
          max: frontPSI + variation
        },
        rear: {
          min: Math.max(rearPSI - variation, 15),
          max: rearPSI + variation
        }
      }
    }
  
    /**
     * Get default bike weights
     */
    private static getDefaultBikeWeight(bikeType: BikeType): number {
      const weights: Record<BikeType, number> = {
        road: 8.5,
        gravel: 10.5,
        cyclocross: 9.5,
        hardtail_xc: 12.5,
        full_suspension_xc: 14.5,
        trail: 16.0,
        enduro: 17.5,
        downhill: 19.0,
        fat_bike: 15.0
      }
      
      return weights[bikeType] || 13.0
    }
  
    /**
     * Get minimum safe pressures
     */
    private static getMinimumPressure(bikeType: BikeType): number {
      const minimums: Record<BikeType, number> = {
        road: 80,
        gravel: 35,
        cyclocross: 30,
        hardtail_xc: 22,
        full_suspension_xc: 20,
        trail: 18,
        enduro: 16,
        downhill: 15,
        fat_bike: 8
      }
      
      return minimums[bikeType] || 20
    }
  
    /**
     * Get maximum safe pressures
     */
    private static getMaximumPressure(bikeType: BikeType, tireWidth: number): number {
      // Base maximums by bike type
      const baseMaximums: Record<BikeType, number> = {
        road: 120,
        gravel: 65,
        cyclocross: 60,
        hardtail_xc: 35,
        full_suspension_xc: 32,
        trail: 30,
        enduro: 28,
        downhill: 25,
        fat_bike: 15
      }
      
      const baseMax = baseMaximums[bikeType] || 40
      
      // Reduce max pressure for wider tires
      if (tireWidth > 50) return Math.min(baseMax, 30)
      if (tireWidth > 40) return Math.min(baseMax, 50)
      if (tireWidth > 30) return Math.min(baseMax, 80)
      
      return baseMax
    }
  
    /**
     * Get tire width recommendations for different terrains
     */
    static getTireWidthRecommendations(terrain: TerrainType): {
      widths: number[]
      default: number
      notes: string[]
    } {
      const recommendations = {
        road_smooth: {
          widths: [23, 25, 28, 30, 32],
          default: 28,
          notes: ['23-25mm: Racing', '28-30mm: Performance', '32mm+: Endurance/Comfort']
        },
        road_rough: {
          widths: [28, 30, 32, 35],
          default: 30,
          notes: ['28-30mm: Performance', '32-35mm: Comfort on rough roads']
        },
        gravel_smooth: {
          widths: [32, 35, 38, 40],
          default: 38,
          notes: ['32-35mm: Fast gravel', '38-40mm: Mixed terrain comfort']
        },
        gravel_rough: {
          widths: [38, 40, 42, 45],
          default: 42,
          notes: ['38-40mm: Mixed terrain', '42-45mm: Rough gravel traction']
        },
        xc_trail: {
          widths: [35, 38, 40, 42, 45],
          default: 40,
          notes: ['35-38mm: XC racing', '40-42mm: Trail riding', '45mm+: Technical trails']
        },
        trail: {
          widths: [45, 50, 55, 60],
          default: 55,
          notes: ['45-50mm: Light trail', '55mm: All-mountain', '60mm+: Aggressive trail']
        },
        enduro: {
          widths: [55, 60, 65, 70],
          default: 65,
          notes: ['55-60mm: Racing', '60-65mm: Mixed conditions', '65mm+: Rough terrain']
        },
        downhill: {
          widths: [60, 65, 70, 75, 80],
          default: 70,
          notes: ['60-65mm: Dry conditions', '65-70mm: Mixed', '70mm+: Wet/loose conditions']
        },
        bike_park: {
          widths: [65, 70, 75, 80],
          default: 70,
          notes: ['65-70mm: Jump lines', '70-75mm: Technical', '75mm+: Maximum grip']
        }
      }
      
      return recommendations[terrain] || recommendations.trail
    }
  
    /**
     * Adjust pressure based on ride feedback
     */
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
  
        // Calculate adjustment based on issue and severity
        const severityMultiplier = {
          mild: 1,
          moderate: 2,
          severe: 3
        }[severity]
  
        switch (issue) {
          case 'too_harsh':
            adjustment = -2 * severityMultiplier
            reasoning = 'Reduce pressure for better comfort and small bump compliance'
            break
          case 'too_soft':
            adjustment = 2 * severityMultiplier
            reasoning = 'Increase pressure for better support and efficiency'
            break
          case 'bottoming_out':
            adjustment = 4 * severityMultiplier
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
            adjustment = -2.5 * severityMultiplier
            reasoning = 'Reduce pressure for better small bump sensitivity'
            break
        }
  
        const currentPSI = component.includes('front') ? currentFrontPSI : currentRearPSI
        const suggestedPSI = Math.round((currentPSI + adjustment) * 2) / 2
  
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
  
  export class SuspensionCalculator {
    
    /**
     * Calculate optimal suspension settings
     */
    static calculateSuspensionSettings(input: SuspensionInput): SuspensionResult {
      const {
        riderWeight,
        gearWeight = 5, // Default 5kg gear weight
        forkModel,
        shockModel,
        bikeType,
        ridingStyle,
        terrain
      } = input
  
      const totalWeight = riderWeight + gearWeight
  
      // Calculate fork settings
      const forkSettings = this.calculateForkSettings(totalWeight, bikeType, ridingStyle, terrain, forkModel)
      
      // Calculate shock settings
      const shockSettings = this.calculateShockSettings(totalWeight, bikeType, ridingStyle, terrain, shockModel)
  
      const recommendations = this.generateSuspensionRecommendations(input, forkSettings, shockSettings)
      const setupNotes = this.generateSetupNotes(bikeType, ridingStyle)
  
      return {
        fork: forkSettings,
        shock: shockSettings,
        recommendations,
        setupNotes
      }
    }
  
    /**
     * Calculate fork settings
     */
    private static calculateForkSettings(
      totalWeight: number,
      bikeType: BikeType,
      ridingStyle: RidingStyle,
      terrain: TerrainType,
      forkModel?: string
    ) {
      // Base pressure calculation (PSI per kg of rider weight)
      const basePressureRatio = this.getForkPressureRatio(bikeType)
      let pressure = totalWeight * basePressureRatio
  
      // Adjust for riding style
      const styleAdjustment = this.getSuspensionStyleAdjustment(ridingStyle)
      pressure *= (1 + styleAdjustment)
  
      // Adjust for terrain
      const terrainAdjustment = this.getSuspensionTerrainAdjustment(terrain)
      pressure *= (1 + terrainAdjustment)
  
      // Calculate target sag
      const targetSag = this.getTargetSag(bikeType, 'fork')
      const travel = this.getTravel(bikeType, 'fork')
      const sagMM = (travel * targetSag) / 100
  
      // Calculate rebound clicks from full slow
      const reboundClicks = this.calculateReboundClicks(totalWeight, bikeType, 'fork')
  
      return {
        pressure: Math.round(pressure),
        sag: Math.round(sagMM),
        sagPercentage: targetSag,
        reboundClicks,
        compressionClicks: this.calculateCompressionClicks(totalWeight, bikeType, 'fork')
      }
    }
  
    /**
     * Calculate shock settings
     */
    private static calculateShockSettings(
      totalWeight: number,
      bikeType: BikeType,
      ridingStyle: RidingStyle,
      terrain: TerrainType,
      shockModel?: string
    ) {
      // Base pressure calculation
      const basePressureRatio = this.getShockPressureRatio(bikeType)
      let pressure = totalWeight * basePressureRatio
  
      // Adjust for riding style and terrain
      const styleAdjustment = this.getSuspensionStyleAdjustment(ridingStyle)
      const terrainAdjustment = this.getSuspensionTerrainAdjustment(terrain)
      pressure *= (1 + styleAdjustment + terrainAdjustment)
  
      // Calculate target sag
      const targetSag = this.getTargetSag(bikeType, 'shock')
      const travel = this.getTravel(bikeType, 'shock')
      const sagMM = (travel * targetSag) / 100
  
      // Calculate rebound clicks
      const reboundClicks = this.calculateReboundClicks(totalWeight, bikeType, 'shock')
  
      return {
        pressure: Math.round(pressure),
        sag: Math.round(sagMM),
        sagPercentage: targetSag,
        reboundClicks,
        compressionClicks: this.calculateCompressionClicks(totalWeight, bikeType, 'shock'),
        leverageRatio: this.getLeverageRatio(bikeType)
      }
    }
  
    /**
     * Get fork pressure ratios (PSI per kg)
     */
    private static getForkPressureRatio(bikeType: BikeType): number {
      const ratios: Record<BikeType, number> = {
        road: 0, // No suspension
        gravel: 0, // No suspension
        cyclocross: 0, // No suspension
        hardtail_xc: 1.8,
        full_suspension_xc: 1.8,
        trail: 1.9,
        enduro: 2.0,
        downhill: 2.2,
        fat_bike: 1.6
      }
      
      return ratios[bikeType] || 1.8
    }
  
    /**
     * Get shock pressure ratios (PSI per kg)
     */
    private static getShockPressureRatio(bikeType: BikeType): number {
      const ratios: Record<BikeType, number> = {
        road: 0, // No suspension
        gravel: 0, // No suspension
        cyclocross: 0, // No suspension
        hardtail_xc: 0, // No rear suspension
        full_suspension_xc: 3.2,
        trail: 3.4,
        enduro: 3.6,
        downhill: 3.8,
        fat_bike: 0 // Usually no rear suspension
      }
      
      return ratios[bikeType] || 3.4
    }
  
    /**
     * Get target sag percentages
     */
    private static getTargetSag(bikeType: BikeType, component: 'fork' | 'shock'): number {
      const sagTargets: Record<BikeType, { fork: number; shock: number }> = {
        road: { fork: 0, shock: 0 },
        gravel: { fork: 0, shock: 0 },
        cyclocross: { fork: 0, shock: 0 },
        hardtail_xc: { fork: 20, shock: 0 },
        full_suspension_xc: { fork: 20, shock: 25 },
        trail: { fork: 25, shock: 30 },
        enduro: { fork: 25, shock: 30 },
        downhill: { fork: 30, shock: 35 },
        fat_bike: { fork: 20, shock: 0 }
      }
      
      return sagTargets[bikeType]?.[component] || 25
    }
  
    /**
     * Get typical travel amounts
     */
    private static getTravel(bikeType: BikeType, component: 'fork' | 'shock'): number {
      const travels: Record<BikeType, { fork: number; shock: number }> = {
        road: { fork: 0, shock: 0 },
        gravel: { fork: 0, shock: 0 },
        cyclocross: { fork: 0, shock: 0 },
        hardtail_xc: { fork: 100, shock: 0 },
        full_suspension_xc: { fork: 100, shock: 100 },
        trail: { fork: 140, shock: 140 },
        enduro: { fork: 160, shock: 160 },
        downhill: { fork: 200, shock: 200 },
        fat_bike: { fork: 100, shock: 0 }
      }
      
      return travels[bikeType]?.[component] || 120
    }
  
    /**
     * Calculate rebound clicks from full slow
     */
    private static calculateReboundClicks(
      totalWeight: number,
      bikeType: BikeType,
      component: 'fork' | 'shock'
    ): number {
      // Base rebound clicks for average rider
      let baseClicks: number
      
      if (component === 'fork') {
        baseClicks = bikeType === 'downhill' ? 8 : 
                     bikeType === 'enduro' ? 7 :
                     bikeType === 'trail' ? 6 : 5
      } else {
        baseClicks = bikeType === 'downhill' ? 10 : 
                     bikeType === 'enduro' ? 9 :
                     bikeType === 'trail' ? 8 : 7
      }
      
      // Adjust for rider weight (heavier riders need slower rebound)
      const weightAdjustment = Math.floor((totalWeight - 75) / 10) // +/- 1 click per 10kg difference from 75kg
      
      return Math.max(0, Math.min(baseClicks + weightAdjustment, 20))
    }
  
    /**
     * Calculate compression clicks (if applicable)
     */
    private static calculateCompressionClicks(
      totalWeight: number,
      bikeType: BikeType,
      component: 'fork' | 'shock'
    ): number | undefined {
      // Only some suspension has external compression adjustment
      if (bikeType === 'hardtail_xc' || bikeType === 'full_suspension_xc') {
        return undefined // Most XC suspension doesn't have external compression
      }
      
      const baseClicks = component === 'fork' ? 6 : 8
      const weightAdjustment = Math.floor((totalWeight - 75) / 15)
      
      return Math.max(0, Math.min(baseClicks + weightAdjustment, 15))
    }
  
    /**
     * Get leverage ratio for shock calculation
     */
    private static getLeverageRatio(bikeType: BikeType): number {
      const ratios: Record<BikeType, number> = {
        road: 0,
        gravel: 0,
        cyclocross: 0,
        hardtail_xc: 0,
        full_suspension_xc: 2.7,
        trail: 2.8,
        enduro: 2.9,
        downhill: 3.0,
        fat_bike: 0
      }
      
      return ratios[bikeType] || 2.8
    }
  
    /**
     * Get riding style adjustments for suspension
     */
    private static getSuspensionStyleAdjustment(ridingStyle: RidingStyle): number {
      const adjustments: Record<RidingStyle, number> = {
        casual: -0.05,
        fitness: 0,
        racing: 0.05,
        aggressive: 0.1,
        technical: 0.08
      }
      
      return adjustments[ridingStyle] || 0
    }
  
    /**
     * Get terrain adjustments for suspension
     */
    private static getSuspensionTerrainAdjustment(terrain: TerrainType): number {
      const adjustments: Record<TerrainType, number> = {
        road_smooth: 0,
        road_rough: 0,
        gravel_smooth: 0,
        gravel_rough: 0,
        xc_trail: 0,
        trail: 0.02,
        enduro: 0.05,
        downhill: 0.08,
        bike_park: 0.1
      }
      
      return adjustments[terrain] || 0
    }
  
    /**
     * Generate suspension setup recommendations
     */
    private static generateSuspensionRecommendations(
      input: SuspensionInput,
      forkSettings: any,
      shockSettings: any
    ): string[] {
      const recommendations: string[] = []
      
      // Sag setup recommendations
      recommendations.push('Set sag first: sit on bike in riding position with full gear')
      recommendations.push('Measure sag after settling - bounce gently 3 times before measuring')
      
      // Rebound recommendations
      recommendations.push('Set rebound: push down and release - should return to sag position in ~1 second')
      recommendations.push('Too fast rebound = bouncy/unstable, too slow = packs down on repeated hits')
      
      // Compression recommendations
      if (forkSettings.compressionClicks) {
        recommendations.push('Adjust compression for terrain: more open for rough/technical, more closed for smooth/climbing')
      }
      
      // Fine-tuning recommendations
      recommendations.push('Test ride and adjust ±2 clicks at a time until it feels right')
      recommendations.push('Keep a suspension log - note settings that work for different trails')
      
      // Maintenance recommendations
      recommendations.push('Service suspension every 50-100 hours or per manufacturer schedule')
      recommendations.push('Check pressure weekly - air springs lose pressure over time')
      
      return recommendations
    }
  
    /**
     * Generate setup notes
     */
    private static generateSetupNotes(bikeType: BikeType, ridingStyle: RidingStyle): string[] {
      const notes: string[] = []
      
      // Basic setup process
      notes.push('1. Set air pressure with shock pump (accurate to ±2 PSI)')
      notes.push('2. Set sag with riding gear and position')
      notes.push('3. Set rebound clicks from full slow position')
      notes.push('4. Set compression (if available) from middle position')
      notes.push('5. Test ride and fine-tune ±2 clicks at a time')
      
      // Bike type specific notes
      if (bikeType.includes('xc')) {
        notes.push('XC Focus: Prioritize pedaling efficiency - run slightly firmer')
        notes.push('Use lockout/climb switch for long climbs and smooth sections')
      }
      
      if (bikeType === 'trail') {
        notes.push('Trail Focus: Balance climbing efficiency with descending performance')
        notes.push('Consider adjustable compression for different terrain')
      }
      
      if (bikeType === 'enduro' || bikeType === 'downhill') {
        notes.push('Gravity Focus: Prioritize traction and control over pedaling efficiency')
        notes.push('Consider volume spacers for better mid-stroke support')
      }
      
      // Riding style specific notes
      if (ridingStyle === 'aggressive' || ridingStyle === 'technical') {
        notes.push('Aggressive Style: Consider adding volume spacers to prevent bottom-out')
        notes.push('Focus on consistent sag through travel range')
      }
      
      return notes
    }
  }
  
  /**
   * Ride Feel Adjustment Wizard
   */
  export class RideFeedbackWizard {
    
    /**
     * Get ride feedback questions for tire pressure
     */
    static getTirePressureQuestions(): Array<{
      id: string
      question: string
      options: Array<{ value: RideFeedbackType; label: string; description: string }>
    }> {
      return [
        {
          id: 'ride_feel',
          question: 'How does your bike feel on typical terrain?',
          options: [
            { 
              value: 'too_harsh', 
              label: 'Too harsh/jarring', 
              description: 'Feels every bump, uncomfortable on rough surfaces' 
            },
            { 
              value: 'too_soft', 
              label: 'Too soft/squishy', 
              description: 'Feels sluggish, tires deform too much when cornering' 
            },
            { 
              value: 'bottoming_out', 
              label: 'Bottoming out', 
              description: 'Rim hits or pinch flats on impacts' 
            },
            { 
              value: 'poor_traction', 
              label: 'Poor traction', 
              description: 'Slipping or sliding, especially in corners' 
            }
          ]
        },
        {
          id: 'rolling_feel',
          question: 'How does your bike feel when pedaling?',
          options: [
            { 
              value: 'slow_rolling', 
              label: 'Feels slow/draggy', 
              description: 'Requires more effort than expected' 
            },
            { 
              value: 'unstable_cornering', 
              label: 'Unstable in corners', 
              description: 'Feels vague or unpredictable when leaning over' 
            },
            { 
              value: 'harsh_small_bumps', 
              label: 'Harsh on small bumps', 
              description: 'Vibration and chatter from road texture' 
            }
          ]
        }
      ]
    }
  
    /**
     * Get ride feedback questions for suspension
     */
    static getSuspensionQuestions(): Array<{
      id: string
      question: string
      component: 'fork' | 'shock'
      options: Array<{ value: RideFeedbackType; label: string; description: string }>
    }> {
      return [
        {
          id: 'fork_feel',
          question: 'How does your front suspension feel?',
          component: 'fork',
          options: [
            { 
              value: 'too_harsh', 
              label: 'Too harsh/rigid', 
              description: 'Not absorbing small bumps, harsh impacts' 
            },
            { 
              value: 'too_soft', 
              label: 'Too soft/divey', 
              description: 'Dives too much under braking, wallowy feel' 
            },
            { 
              value: 'bottoming_out', 
              label: 'Bottoming out', 
              description: 'Using full travel on normal hits' 
            },
            { 
              value: 'poor_pedaling_platform', 
              label: 'Bobs when pedaling', 
              description: 'Suspension moves too much when pedaling hard' 
            }
          ]
        },
        {
          id: 'shock_feel',
          question: 'How does your rear suspension feel?',
          component: 'shock',
          options: [
            { 
              value: 'too_harsh', 
              label: 'Too harsh/rigid', 
              description: 'Not absorbing bumps, kicks back on impacts' 
            },
            { 
              value: 'too_soft', 
              label: 'Too soft/wallowy', 
              description: 'Feels unstable, too much movement' 
            },
            { 
              value: 'bottoming_out', 
              label: 'Bottoming out', 
              description: 'Using full travel on normal hits' 
            },
            { 
              value: 'poor_pedaling_platform', 
              label: 'Pedal bob', 
              description: 'Bounces too much when climbing or sprinting' 
            }
          ]
        }
      ]
    }
  
    /**
     * Process ride feedback and generate adjustments
     */
    static processRideFeedback(
      currentSettings: {
        frontTirePSI?: number
        rearTirePSI?: number
        forkPressure?: number
        forkRebound?: number
        forkCompression?: number
        shockPressure?: number
        shockRebound?: number
        shockCompression?: number
      },
      feedback: Array<{
        questionId: string
        selectedOptions: RideFeedbackType[]
        severity: 'mild' | 'moderate' | 'severe'
        component?: 'fork' | 'shock' | 'front_tire' | 'rear_tire'
      }>
    ): FeedbackAdjustment[] {
      const adjustments: FeedbackAdjustment[] = []
  
      feedback.forEach(item => {
        item.selectedOptions.forEach(option => {
          const rideFeedback: RideFeedback = {
            issue: option,
            severity: item.severity,
            component: item.component || 'front_tire'
          }
  
          // Generate tire pressure adjustments
          if (item.component?.includes('tire') && currentSettings.frontTirePSI && currentSettings.rearTirePSI) {
            const tireAdjustments = TirePressureCalculator.adjustPressureFromFeedback(
              currentSettings.frontTirePSI,
              currentSettings.rearTirePSI,
              [rideFeedback]
            )
            adjustments.push(...tireAdjustments)
          }
  
          // Generate suspension adjustments
          if (item.component === 'fork' || item.component === 'shock') {
            const suspensionAdjustments = this.generateSuspensionAdjustments(
              currentSettings,
              rideFeedback
            )
            adjustments.push(...suspensionAdjustments)
          }
        })
      })
  
      return adjustments
    }
  
    /**
     * Generate suspension-specific adjustments
     */
    private static generateSuspensionAdjustments(
      currentSettings: any,
      feedback: RideFeedback
    ): FeedbackAdjustment[] {
      const adjustments: FeedbackAdjustment[] = []
      const { issue, severity, component } = feedback
  
      const severityMultiplier = {
        mild: 1,
        moderate: 2,
        severe: 3
      }[severity]
  
      if (component === 'fork') {
        // Fork pressure adjustments
        if (currentSettings.forkPressure) {
          let pressureChange = 0
          let reasoning = ''
  
          switch (issue) {
            case 'too_harsh':
              pressureChange = -5 * severityMultiplier
              reasoning = 'Reduce fork pressure for better small bump compliance'
              break
            case 'too_soft':
              pressureChange = 5 * severityMultiplier
              reasoning = 'Increase fork pressure for better support'
              break
            case 'bottoming_out':
              pressureChange = 10 * severityMultiplier
              reasoning = 'Increase fork pressure to prevent bottom-out'
              break
            case 'poor_pedaling_platform':
              reasoning = 'Increase compression damping or use lockout'
              break
          }
  
          if (pressureChange !== 0) {
            adjustments.push({
              component: 'Fork Pressure',
              currentValue: currentSettings.forkPressure,
              suggestedValue: currentSettings.forkPressure + pressureChange,
              change: pressureChange,
              reasoning,
              confidence: 85
            })
          }
        }
  
        // Fork rebound adjustments
        if (currentSettings.forkRebound && (issue === 'too_harsh' || issue === 'too_soft')) {
          let reboundChange = 0
          let reasoning = ''
  
          if (issue === 'too_harsh') {
            reboundChange = -1 * severityMultiplier
            reasoning = 'Speed up rebound for better small bump tracking'
          } else if (issue === 'too_soft') {
            reboundChange = 1 * severityMultiplier
            reasoning = 'Slow down rebound for more control'
          }
  
          adjustments.push({
            component: 'Fork Rebound',
            currentValue: currentSettings.forkRebound,
            suggestedValue: currentSettings.forkRebound + reboundChange,
            change: reboundChange,
            reasoning,
            confidence: 80
          })
        }
      }
  
      if (component === 'shock') {
        // Similar logic for shock adjustments
        if (currentSettings.shockPressure) {
          let pressureChange = 0
          let reasoning = ''
  
          switch (issue) {
            case 'too_harsh':
              pressureChange = -5 * severityMultiplier
              reasoning = 'Reduce shock pressure for better bump absorption'
              break
            case 'too_soft':
              pressureChange = 5 * severityMultiplier
              reasoning = 'Increase shock pressure for better support'
              break
            case 'bottoming_out':
              pressureChange = 10 * severityMultiplier
              reasoning = 'Increase shock pressure to prevent bottom-out'
              break
            case 'poor_pedaling_platform':
              reasoning = 'Increase compression damping or add volume spacer'
              break
          }
  
          if (pressureChange !== 0) {
            adjustments.push({
              component: 'Shock Pressure',
              currentValue: currentSettings.shockPressure,
              suggestedValue: currentSettings.shockPressure + pressureChange,
              change: pressureChange,
              reasoning,
              confidence: 85
            })
          }
        }
      }
  
      return adjustments
    }
  }
  
  // Export utility functions for easy use
  export const calculateTirePressure = TirePressureCalculator.calculateOptimalPressure
  export const calculateSuspension = SuspensionCalculator.calculateSuspensionSettings
  export const adjustFromFeedback = TirePressureCalculator.adjustPressureFromFeedback
  export const getFeedbackQuestions = RideFeedbackWizard.getTirePressureQuestions