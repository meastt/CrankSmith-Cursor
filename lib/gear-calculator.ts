// lib/gear-calculator.ts - COMPLETE WORKING VERSION

import { 
  BikeSetup, 
  ComparisonResults, 
  Component,
  CompatibilityStatus,
  CompatibilityIssue,
  CompatibilitySolution,
  CrossChainingIssue,
  GearRatio,
  TirePressureResult,
  ChainLengthResult,
  ChainlineResult,
  CostBreakdown,
  PerformanceMetrics,
  WeightComparison,
  CostAnalysis,
  SpeedMetric,
  GearMetric,
  RangeMetric,
  EfficiencyMetrics,
  CrossChainingAnalysis
} from '@/types/gear-calculator'

export class GearCalculator {
  /**
   * Calculate top speed based on largest chainring and smallest cog
   */
  static calculateTopSpeed(cassette: any, chainring: any, wheelDiameter = 29, cadence = 90): number {
    if (!cassette?.cogs || !chainring?.teeth) return 0
    
    const largestChainring = chainring.teeth
    const smallestCog = Math.min(...cassette.cogs)
    const gearRatio = largestChainring / smallestCog
    
    // Speed in mph: (gear ratio × wheel circumference × cadence × 60) / 63360
    const wheelCircumference = wheelDiameter * Math.PI // inches
    const speedMph = (gearRatio * wheelCircumference * cadence * 60) / 63360
    
    return Math.round(speedMph * 10) / 10
  }

  /**
   * Calculate climbing gear based on smallest chainring and largest cog
   */
  static calculateClimbingGear(cassette: any, chainring: any): number {
    if (!cassette?.cogs || !chainring?.teeth) return 0
    
    const smallestChainring = chainring.teeth
    const largestCog = Math.max(...cassette.cogs)
    
    return Math.round((smallestChainring / largestCog) * 100) / 100
  }

  /**
   * Calculate gear range as percentage
   */
  static calculateGearRange(cassette: any, chainring: any): number {
    if (!cassette?.cogs || !chainring?.teeth) return 0
    
    const largestCog = Math.max(...cassette.cogs)
    const smallestCog = Math.min(...cassette.cogs)
    
    return Math.round(((largestCog / smallestCog) - 1) * 100)
  }

  /**
   * Generate all possible gear ratios
   */
  static generateGearRatios(cassette: any, chainring: any): GearRatio[] {
    if (!cassette?.cogs || !chainring?.teeth) return []
    
    const ratios: GearRatio[] = []
    const chainringTeeth = chainring.teeth
    
    cassette.cogs.forEach((cog: number) => {
      ratios.push({
        chainring: chainringTeeth,
        cog: cog,
        ratio: Math.round((chainringTeeth / cog) * 100) / 100
      })
    })
    
    return ratios.sort((a, b) => b.ratio - a.ratio) // Sort highest to lowest
  }

  /**
   * Analyze cross-chaining issues
   */
  static analyzeCrossChaining(cassette: any, chainring: any): CrossChainingIssue[] {
    if (!cassette?.cogs || !chainring?.teeth) return []
    
    const issues: CrossChainingIssue[] = []
    const cogs = cassette.cogs
    const chainringTeeth = chainring.teeth
    
    // Check smallest cogs (cross-chaining with big chainring)
    const smallestCogs = cogs.slice(0, Math.min(3, cogs.length))
    smallestCogs.forEach((cog: number) => {
      if (cog <= cogs[2]) { // Top 3 smallest cogs
        issues.push({
          gear: `${chainringTeeth}T x ${cog}T`,
          severity: cog === cogs[0] ? 'high' : 'medium',
          efficiencyLoss: cog === cogs[0] ? 8 : 5, // percentage
          recommendation: `Avoid using ${cog}T cog with ${chainringTeeth}T chainring for better chain life`
        })
      }
    })
    
    return issues
  }

  /**
   * Calculate total weight of components
   */
  static calculateTotalWeight(components: (Component | undefined)[]): number {
    return components.reduce((total, component) => {
      return total + (component?.weightGrams || 0)
    }, 0)
  }

  /**
   * Calculate total cost of components
   */
  static calculateTotalCost(components: (Component | undefined)[]): number {
    return components.reduce((total, component) => {
      return total + (component?.msrp || 0)
    }, 0)
  }

  /**
   * Check compatibility between components
   */
  static checkCompatibility(current: BikeSetup, proposed: BikeSetup): CompatibilityStatus {
    const issues: CompatibilityIssue[] = []
    const solutions: CompatibilitySolution[] = []

    // Check cassette/hub compatibility
    const cassette = proposed.cassette
    const hub = proposed.hub || current.hub

    if (cassette?.cassette && hub?.hub) {
      const cassetteFreehub = cassette.cassette.freehubType
      const hubFreehubs = hub.hub.freehubTypes

      if (!hubFreehubs.includes(cassetteFreehub)) {
        issues.push({
          type: 'freehub',
          severity: 'critical',
          message: `Cassette requires ${cassetteFreehub} freehub, but hub has ${hubFreehubs.join(', ')}`,
          components: [cassette.manufacturer + ' ' + cassette.model, hub.manufacturer + ' ' + hub.model],
          costToFix: 150,
          estimatedCost: 150
        })

        solutions.push({
          type: 'replace',
          description: 'Replace freehub body or select compatible cassette',
          cost: 150,
          effort: 'medium',
          reliability: 95,
          components: [cassette.manufacturer + ' ' + cassette.model],
          message: 'Replace freehub body or select compatible cassette',
          difficulty: 'medium'
        })
      }
    }

    // Check derailleur capacity
    const derailleur = proposed.derailleur || current.derailleur
    if (cassette?.cassette && derailleur?.derailleur) {
      const largestCog = Math.max(...cassette.cassette.cogs)
      const maxCog = derailleur.derailleur.maxCog || derailleur.derailleur.capacity || 50

      if (largestCog > maxCog) {
        issues.push({
          type: 'capacity',
          severity: 'critical',
          message: `Derailleur max capacity is ${maxCog}T, but cassette has ${largestCog}T cog`,
          components: [derailleur.manufacturer + ' ' + derailleur.model, cassette.manufacturer + ' ' + cassette.model],
          costToFix: 200,
          estimatedCost: 200
        })

        solutions.push({
          type: 'replace',
          description: 'Upgrade to derailleur with higher capacity or choose smaller cassette',
          cost: 200,
          effort: 'medium',
          reliability: 98,
          components: [derailleur.manufacturer + ' ' + derailleur.model],
          message: 'Upgrade to derailleur with higher capacity or choose smaller cassette',
          difficulty: 'medium'
        })
      }
    }

    // Check chain compatibility
    const chain = proposed.chain || current.chain
    if (cassette?.cassette && chain?.chain) {
      if (cassette.cassette.speeds !== chain.chain.speeds) {
        issues.push({
          type: 'chain',
          severity: 'critical',
          message: `Chain is ${chain.chain.speeds}-speed but cassette is ${cassette.cassette.speeds}-speed`,
          components: [chain.manufacturer + ' ' + chain.model, cassette.manufacturer + ' ' + cassette.model],
          costToFix: 50,
          estimatedCost: 50
        })

        solutions.push({
          type: 'replace',
          description: 'Replace chain with correct speed rating',
          cost: 50,
          effort: 'easy',
          reliability: 100,
          components: [chain.manufacturer + ' ' + chain.model],
          message: 'Replace chain with correct speed rating',
          difficulty: 'easy'
        })
      }
    }

    const isCompatible = issues.length === 0
    const hasCriticalIssues = issues.some(issue => issue.severity === 'critical')
    const overallStatus = isCompatible ? 'compatible' : 
                         hasCriticalIssues ? 'incompatible' : 'warning'

    return {
      status: overallStatus,
      issues,
      solutions,
      confidence: Math.max(0, 100 - (issues.length * 15)),
      isCompatible,
      overallStatus
    }
  }

  /**
   * Main comparison function - compares two complete setups
   */
  static compareSetups(current: BikeSetup, proposed: BikeSetup): ComparisonResults {
    // Performance calculations
    const performance = this.calculatePerformanceMetrics(current, proposed)
    
    // Weight comparison
    const weight = this.calculateWeightComparison(current, proposed)
    
    // Compatibility check
    const compatibility = this.checkCompatibility(current, proposed)
    
    // Cost analysis
    const cost = this.calculateCostAnalysis(current, proposed, compatibility)

    return {
      performance,
      weight,
      compatibility,
      cost
    }
  }

  /**
   * Calculate performance metrics comparison
   */
  static calculatePerformanceMetrics(current: BikeSetup, proposed: BikeSetup): PerformanceMetrics {
    const currentTopSpeed = this.calculateTopSpeed(current.cassette?.cassette, current.chainring?.chainring || current.chainring?.crankset)
    const proposedTopSpeed = this.calculateTopSpeed(proposed.cassette?.cassette, proposed.chainring?.chainring || proposed.chainring?.crankset)
    
    const currentClimbingGear = this.calculateClimbingGear(current.cassette?.cassette, current.chainring?.chainring || current.chainring?.crankset)
    const proposedClimbingGear = this.calculateClimbingGear(proposed.cassette?.cassette, proposed.chainring?.chainring || proposed.chainring?.crankset)
    
    const currentGearRange = this.calculateGearRange(current.cassette?.cassette, current.chainring?.chainring || current.chainring?.crankset)
    const proposedGearRange = this.calculateGearRange(proposed.cassette?.cassette, proposed.chainring?.chainring || proposed.chainring?.crankset)

    const topSpeed: SpeedMetric = {
      current: currentTopSpeed,
      proposed: proposedTopSpeed,
      unit: 'mph',
      difference: Math.round((proposedTopSpeed - currentTopSpeed) * 10) / 10,
      percentage: currentTopSpeed > 0 ? Math.round(((proposedTopSpeed - currentTopSpeed) / currentTopSpeed) * 100) : 0
    }

    const climbingGear: GearMetric = {
      current: currentClimbingGear,
      proposed: proposedClimbingGear,
      unit: 'ratio',
      difference: Math.round((proposedClimbingGear - currentClimbingGear) * 100) / 100
    }

    const gearRange: RangeMetric = {
      current: currentGearRange,
      proposed: proposedGearRange,
      unit: '%',
      difference: proposedGearRange - currentGearRange
    }

    const gearRatios = this.generateGearRatios(
      proposed.cassette?.cassette, 
      proposed.chainring?.chainring || proposed.chainring?.crankset
    )

    const currentCrossChaining = this.analyzeCrossChaining(
      current.cassette?.cassette, 
      current.chainring?.chainring || current.chainring?.crankset
    )
    const proposedCrossChaining = this.analyzeCrossChaining(
      proposed.cassette?.cassette, 
      proposed.chainring?.chainring || proposed.chainring?.crankset
    )

    const crossChaining: CrossChainingAnalysis = {
      current: currentCrossChaining,
      proposed: proposedCrossChaining,
      improvement: Math.max(0, currentCrossChaining.length - proposedCrossChaining.length) * 20 // 20% per issue resolved
    }

    const efficiency: EfficiencyMetrics = {
      crossChaining,
      optimalGears: gearRatios.slice(2, -2).map(gr => gr.cog), // Middle gears are most efficient
      efficiencyLoss: proposedCrossChaining.reduce((total, issue) => total + issue.efficiencyLoss, 0)
    }

    return {
      topSpeed,
      climbingGear,
      gearRange,
      gearRatios,
      efficiency
    }
  }

  /**
   * Calculate weight comparison
   */
  static calculateWeightComparison(current: BikeSetup, proposed: BikeSetup): WeightComparison {
    const currentComponents = [
      current.cassette,
      current.chainring,
      current.chain,
      current.wheel,
      current.tire,
      current.derailleur,
      current.hub
    ]

    const proposedComponents = [
      proposed.cassette,
      proposed.chainring,
      proposed.chain,
      proposed.wheel,
      proposed.tire,
      proposed.derailleur,
      proposed.hub
    ]

    const currentWeight = this.calculateTotalWeight(currentComponents)
    const proposedWeight = this.calculateTotalWeight(proposedComponents)
    const difference = proposedWeight - currentWeight

    return {
      current: currentWeight,
      proposed: proposedWeight,
      difference,
      unit: 'g',
      percentage: currentWeight > 0 ? Math.round((difference / currentWeight) * 100) : 0,
      costPerGram: difference < 0 ? Math.abs(difference) / Math.abs(difference) : undefined
    }
  }

  /**
   * Calculate cost analysis
   */
  static calculateCostAnalysis(current: BikeSetup, proposed: BikeSetup, compatibility: CompatibilityStatus): CostAnalysis {
    const currentComponents = [
      current.cassette,
      current.chainring,
      current.chain,
      current.wheel,
      current.tire,
      current.derailleur,
      current.hub
    ]

    const proposedComponents = [
      proposed.cassette,
      proposed.chainring,
      proposed.chain,
      proposed.wheel,
      proposed.tire,
      proposed.derailleur,
      proposed.hub
    ]

    const currentCost = this.calculateTotalCost(currentComponents)
    const proposedCost = this.calculateTotalCost(proposedComponents)
    const compatibilityCost = compatibility.issues.reduce((total, issue) => total + issue.estimatedCost, 0)

    const breakdown: CostBreakdown[] = [
      {
        component: 'Components',
        currentCost: currentCost,
        proposedCost: proposedCost,
        difference: proposedCost - currentCost
      }
    ]

    if (compatibilityCost > 0) {
      breakdown.push({
        component: 'Compatibility Fixes',
        currentCost: 0,
        proposedCost: compatibilityCost,
        difference: compatibilityCost
      })
    }

    return {
      current: currentCost,
      proposed: proposedCost + compatibilityCost,
      difference: (proposedCost + compatibilityCost) - currentCost,
      currency: 'USD',
      includesCompatibilityFixes: compatibilityCost > 0,
      breakdown
    }
  }

  /**
   * Calculate optimal tire pressure based on rider weight and conditions
   */
  static calculateTirePressure(
    riderWeight: number, // lbs
    bikeWeight: number, // lbs
    tireWidth: number, // inches
    terrain: 'road' | 'gravel' | 'trail' | 'downhill',
    tubeless = false
  ): TirePressureResult {
    const totalWeight = riderWeight + bikeWeight
    const baseMultiplier = tubeless ? 0.85 : 1.0 // Tubeless runs lower pressure
    
    // Base pressure calculation (simplified formula)
    let basePressure = (totalWeight / tireWidth) * 0.3
    
    // Terrain adjustments
    const terrainMultipliers = {
      road: 1.2,
      gravel: 0.9,
      trail: 0.7,
      downhill: 0.6
    }
    
    basePressure *= terrainMultipliers[terrain] * baseMultiplier
    
    // Front/rear weight distribution (60% rear, 40% front)
    const frontPSI = Math.round(basePressure * 0.9)
    const rearPSI = Math.round(basePressure * 1.1)
    
    const notes: string[] = []
    const recommendations: string[] = []
    
    if (tubeless) {
      notes.push('Tubeless setup allows for lower pressures')
      recommendations.push('Check tire pressure before each ride')
    }
    
    if (terrain === 'trail' || terrain === 'downhill') {
      recommendations.push('Lower pressure improves traction on rough terrain')
    }
    
    return {
      frontPSI,
      rearPSI,
      range: {
        min: Math.round(basePressure * 0.8),
        max: Math.round(basePressure * 1.2)
      },
      notes,
      recommendations
    }
  }

  /**
   * Calculate required chain length
   */
  static calculateChainLength(
    largestChainring: number,
    largestCog: number,
    chainstayLength: number // mm
  ): ChainLengthResult {
    // Simplified chain length calculation
    // Real formula: 2 × chainstay + (large chainring + large cog)/4 + 1 link
    const baseLength = (2 * chainstayLength) + ((largestChainring + largestCog) / 4) + 25.4 // +1 inch in mm
    const links = Math.ceil(baseLength / 12.7) // 12.7mm per link (1/2 inch pitch)
    
    // Ensure even number of links for proper connection
    const finalLinks = links % 2 === 0 ? links : links + 1
    
    return {
      links: finalLinks,
      length: finalLinks * 12.7,
      tolerance: {
        min: finalLinks - 2,
        max: finalLinks + 2
      },
      notes: [
        'Formula: 2 × chainstay + (large chainring + large cog)/4 + 1 link',
        'Adjust based on derailleur position and chain tension'
      ]
    }
  }

  /**
   * Analyze chainline for optimal drivetrain alignment
   */
  static analyzeChainline(
    chainringOffset: number, // mm from centerline
    cassetteCenter: number, // mm from centerline
    chainstayLength: number // mm
  ): ChainlineResult {
    const currentChainline = Math.abs(chainringOffset - cassetteCenter)
    const optimalChainline = 0 // Perfect alignment
    const deviation = currentChainline - optimalChainline
    
    // Calculate efficiency loss based on chainline deviation
    const efficiency = Math.max(0, 100 - (Math.abs(deviation) * 2)) // 2% loss per mm deviation
    
    const recommendations: string[] = []
    
    if (Math.abs(deviation) > 5) {
      recommendations.push('Consider adjusting chainring offset or cassette position')
    }
    
    if (Math.abs(deviation) > 10) {
      recommendations.push('Significant chainline issue - may cause excessive wear')
    }
    
    if (Math.abs(deviation) < 2) {
      recommendations.push('Excellent chainline alignment')
    }
    
    return {
      optimalChainline,
      currentChainline,
      deviation,
      efficiency,
      recommendations
    }
  }
}