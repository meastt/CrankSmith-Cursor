// lib/gear-calculator.ts - Complete working version

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
  CostBreakdown
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
        cog,
        ratio: Math.round((chainringTeeth / cog) * 100) / 100
      })
    })
    
    return ratios.sort((a, b) => b.ratio - a.ratio)
  }

  /**
   * Analyze cross-chaining issues
   */
  static analyzeCrossChaining(cassette: any, chainring: any): CrossChainingIssue[] {
    if (!cassette?.cogs || !chainring?.teeth) return []
    
    const issues: CrossChainingIssue[] = []
    const chainringTeeth = chainring.teeth
    const cogCount = cassette.cogs.length
    
    cassette.cogs.forEach((cog: number, index: number) => {
      let severity: 'low' | 'medium' | 'high' = 'low'
      let efficiencyLoss = 0
      let recommendation = ''
      
      // Check for extreme cross-chaining
      if (index < 2) { // Smallest cogs
        severity = 'high'
        efficiencyLoss = 8
        recommendation = 'Avoid using smallest cogs with this chainring for extended periods'
      } else if (index >= cogCount - 2) { // Largest cogs
        severity = 'high' 
        efficiencyLoss = 6
        recommendation = 'Consider using a smaller chainring for these larger cogs'
      } else if (index < 4 || index >= cogCount - 4) {
        severity = 'medium'
        efficiencyLoss = 3
        recommendation = 'Moderate cross-chaining - acceptable for short periods'
      }
      
      if (severity !== 'low') {
        issues.push({
          gear: `${chainringTeeth}T x ${cog}T`,
          severity,
          efficiencyLoss,
          recommendation
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
          message: `Cassette requires ${cassetteFreehub} freehub but hub only supports ${hubFreehubs.join(', ')}`,
          components: [cassette.manufacturer + ' ' + cassette.model, hub.manufacturer + ' ' + hub.model],
          costToFix: 45,
          estimatedCost: 45
        })

        solutions.push({
          type: 'replace',
          description: `Purchase ${cassetteFreehub} freehub body`,
          cost: 45,
          effort: 'medium',
          reliability: 95,
          message: `Purchase ${cassetteFreehub} freehub body for ${hub.manufacturer} ${hub.model}`,
          difficulty: 'medium'
        })
      }
    }

    // Check derailleur capacity
    const derailleur = proposed.derailleur || current.derailleur
    
    if (cassette?.cassette && derailleur?.derailleur) {
      const maxCog = Math.max(...cassette.cassette.cogs)
      
      if (derailleur.derailleur.maxCog && maxCog > derailleur.derailleur.maxCog) {
        issues.push({
          type: 'capacity',
          severity: 'critical',
          message: `Derailleur max cog is ${derailleur.derailleur.maxCog}t but cassette has ${maxCog}t`,
          components: [derailleur.manufacturer + ' ' + derailleur.model, cassette.manufacturer + ' ' + cassette.model],
          costToFix: 95,
          estimatedCost: 95
        })

        solutions.push({
          type: 'upgrade',
          description: `Upgrade to derailleur with larger capacity`,
          cost: 95,
          effort: 'easy',
          reliability: 100,
          message: `Upgrade to derailleur with minimum ${maxCog}t capacity`,
          difficulty: 'easy'
        })
      }
    }

    // Check speed compatibility
    const speedComponents = [cassette, derailleur].filter(c => 
      c?.cassette?.speeds || c?.derailleur?.speeds
    )
    
    if (speedComponents.length >= 2) {
      const speeds = speedComponents.map(c => c?.cassette?.speeds || c?.derailleur?.speeds)
      const uniqueSpeeds = [...new Set(speeds)]
      
      if (uniqueSpeeds.length > 1) {
        issues.push({
          type: 'other',
          severity: 'medium',
          message: `Speed mismatch: Found ${uniqueSpeeds.join(' and ')} speed components`,
          components: speedComponents.map(c => c!.manufacturer + ' ' + c!.model),
          costToFix: 0,
          estimatedCost: 0
        })
      }
    }

    // Determine overall status
    const hasCritical = issues.some(i => i.severity === 'critical')
    const hasHigh = issues.some(i => i.severity === 'high')
    
    let status: 'compatible' | 'warning' | 'incompatible' = 'compatible'
    if (hasCritical) {
      status = 'incompatible'
    } else if (hasHigh || issues.length > 0) {
      status = 'warning'
    }
    
    const confidence = Math.max(0, 100 - (issues.length * 15))
    const isCompatible = status === 'compatible'
    
    return {
      status,
      issues,
      solutions,
      confidence,
      isCompatible,
      overallStatus: status
    }
  }

  /**
   * Main comparison function - the heart of the two-card comparison
   */
  static compareSetups(current: BikeSetup, proposed: BikeSetup): ComparisonResults {
    // Performance calculations
    const currentCassette = current.cassette?.cassette
    const currentChainring = current.chainring?.chainring
    const proposedCassette = proposed.cassette?.cassette
    const proposedChainring = proposed.chainring?.chainring
    
    if (!currentCassette || !currentChainring || !proposedCassette || !proposedChainring) {
      throw new Error('Both current and proposed setups must have cassette and chainring data')
    }
    
    const currentTopSpeed = this.calculateTopSpeed(currentCassette, currentChainring)
    const proposedTopSpeed = this.calculateTopSpeed(proposedCassette, proposedChainring)
    
    const currentClimbingGear = this.calculateClimbingGear(currentCassette, currentChainring)
    const proposedClimbingGear = this.calculateClimbingGear(proposedCassette, proposedChainring)
    
    const currentGearRange = this.calculateGearRange(currentCassette, currentChainring)
    const proposedGearRange = this.calculateGearRange(proposedCassette, proposedChainring)
    
    const currentGearRatios = this.generateGearRatios(currentCassette, currentChainring)
    const proposedGearRatios = this.generateGearRatios(proposedCassette, proposedChainring)
    
    const currentCrossChaining = this.analyzeCrossChaining(currentCassette, currentChainring)
    const proposedCrossChaining = this.analyzeCrossChaining(proposedCassette, proposedChainring)
    
    // Weight calculations
    const currentComponents = [current.cassette, current.chainring, current.chain, current.wheel, current.tire]
    const proposedComponents = [proposed.cassette, proposed.chainring, proposed.chain, proposed.wheel, proposed.tire]
    
    const currentWeight = this.calculateTotalWeight(currentComponents)
    const proposedWeight = this.calculateTotalWeight(proposedComponents)
    
    // Cost calculations
    const currentCost = this.calculateTotalCost(currentComponents)
    const proposedCost = this.calculateTotalCost(proposedComponents)
    
    // Compatibility check
    const compatibility = this.checkCompatibility(current, proposed)
    
    // Calculate additional costs for compatibility fixes
    const compatibilityCost = compatibility.solutions.reduce((total, solution) => total + solution.cost, 0)
    const totalProposedCost = proposedCost + compatibilityCost
    
    return {
      performance: {
        topSpeed: {
          current: currentTopSpeed,
          proposed: proposedTopSpeed,
          unit: 'mph',
          difference: proposedTopSpeed - currentTopSpeed,
          percentage: ((proposedTopSpeed - currentTopSpeed) / currentTopSpeed) * 100
        },
        climbingGear: {
          current: currentClimbingGear,
          proposed: proposedClimbingGear,
          unit: 'ratio',
          difference: proposedClimbingGear - currentClimbingGear
        },
        gearRange: {
          current: currentGearRange,
          proposed: proposedGearRange,
          unit: '%',
          difference: proposedGearRange - currentGearRange
        },
        gearRatios: proposedGearRatios,
        efficiency: {
          crossChaining: {
            current: currentCrossChaining,
            proposed: proposedCrossChaining,
            improvement: this.calculateCrossChainingImprovement(currentCrossChaining, proposedCrossChaining)
          },
          optimalGears: this.findOptimalGears(proposedGearRatios),
          efficiencyLoss: this.calculateEfficiencyLoss(proposedCrossChaining)
        }
      },
      weight: {
        current: currentWeight,
        proposed: proposedWeight,
        difference: proposedWeight - currentWeight,
        unit: 'g',
        percentage: ((proposedWeight - currentWeight) / currentWeight) * 100,
        costPerGram: currentWeight > proposedWeight ? 
          (totalProposedCost - currentCost) / (currentWeight - proposedWeight) : undefined
      },
      compatibility,
      cost: {
        current: currentCost,
        proposed: totalProposedCost,
        difference: totalProposedCost - currentCost,
        currency: 'USD',
        includesCompatibilityFixes: compatibilityCost > 0,
        breakdown: this.generateCostBreakdown(currentComponents, proposedComponents, compatibilityCost)
      }
    }
  }

  /**
   * Calculate cross-chaining improvement
   */
  private static calculateCrossChainingImprovement(
    current: CrossChainingIssue[],
    proposed: CrossChainingIssue[]
  ): number {
    const currentTotalLoss = current.reduce((sum, issue) => sum + issue.efficiencyLoss, 0)
    const proposedTotalLoss = proposed.reduce((sum, issue) => sum + issue.efficiencyLoss, 0)
    return Math.max(0, currentTotalLoss - proposedTotalLoss)
  }

  /**
   * Find optimal gears (efficient gear ratios)
   */
  private static findOptimalGears(gearRatios: GearRatio[]): number[] {
    // Optimal gears are typically in the middle range
    const sortedRatios = gearRatios.map((gear, index) => ({ ...gear, index })).sort((a, b) => b.ratio - a.ratio)
    const middleStart = Math.floor(sortedRatios.length * 0.3)
    const middleEnd = Math.floor(sortedRatios.length * 0.7)
    return sortedRatios.slice(middleStart, middleEnd).map(gear => gear.index)
  }

  /**
   * Calculate total efficiency loss from cross-chaining
   */
  private static calculateEfficiencyLoss(crossChainingIssues: CrossChainingIssue[]): number {
    return crossChainingIssues.reduce((total, issue) => total + issue.efficiencyLoss, 0)
  }

  /**
   * Generate cost breakdown
   */
  private static generateCostBreakdown(
    currentComponents: (Component | undefined)[],
    proposedComponents: (Component | undefined)[],
    compatibilityCost: number
  ): CostBreakdown[] {
    const breakdown: CostBreakdown[] = []
    
    const componentTypes = ['cassette', 'chainring', 'chain', 'wheel', 'tire']
    
    componentTypes.forEach((type, index) => {
      const current = currentComponents[index]
      const proposed = proposedComponents[index]
      
      if (current || proposed) {
        breakdown.push({
          component: type,
          currentCost: current?.msrp || 0,
          proposedCost: proposed?.msrp || 0,
          difference: (proposed?.msrp || 0) - (current?.msrp || 0)
        })
      }
    })
    
    if (compatibilityCost > 0) {
      breakdown.push({
        component: 'compatibility fixes',
        currentCost: 0,
        proposedCost: compatibilityCost,
        difference: compatibilityCost
      })
    }
    
    return breakdown
  }

  /**
   * Calculate tire pressure based on rider weight and terrain
   */
  static calculateTirePressure(
    riderWeight: number,
    bikeWeight: number,
    tireWidth: number,
    terrain: string,
    tubeless: boolean
  ): TirePressureResult {
    const totalWeight = riderWeight + bikeWeight
    
    // Base pressure calculation (simplified)
    let basePressure = (totalWeight * 0.3) + (tireWidth * 0.5)
    
    // Terrain adjustments
    const terrainMultipliers = {
      road: 1.2,
      gravel: 0.9,
      trail: 0.7,
      downhill: 0.6
    }
    
    const multiplier = terrainMultipliers[terrain as keyof typeof terrainMultipliers] || 1.0
    basePressure *= multiplier
    
    // Tubeless adjustment
    if (tubeless) {
      basePressure *= 0.9
    }
    
    const frontPSI = Math.round(basePressure * 0.9)
    const rearPSI = Math.round(basePressure * 1.1)
    
    return {
      frontPSI,
      rearPSI,
      range: {
        min: Math.round(basePressure * 0.8),
        max: Math.round(basePressure * 1.2)
      },
      notes: [
        tubeless ? 'Tubeless setup allows for lower pressure' : 'Consider tubeless for lower pressure options',
        'Adjust ±5 PSI based on personal preference'
      ],
      recommendations: [
        'Start with recommended pressure and adjust based on feel',
        'Lower pressure for more traction, higher for efficiency'
      ]
    }
  }

  /**
   * Calculate chain length
   */
  static calculateChainLength(
    largestChainring: number,
    largestCog: number,
    chainstayLength: number,
    derailleurType: string = 'standard'
  ): ChainLengthResult {
    // Simplified chain length calculation
    const baseLength = 2 * chainstayLength + largestChainring + largestCog + 4
    const links = Math.ceil(baseLength / 12.7) // Convert mm to links (12.7mm per link)
    
    // Ensure even number of links for standard chains
    const finalLinks = links % 2 === 0 ? links : links + 1
    
    return {
      links: finalLinks,
      length: finalLinks * 12.7,
      tolerance: {
        min: finalLinks - 2,
        max: finalLinks + 2
      },
      notes: [
        'This is a simplified calculation',
        'Always verify with actual derailleur position',
        'Consider chain line and derailleur capacity'
      ]
    }
  }

  /**
   * Analyze chainline
   */
  static analyzeChainline(
    chainringOffset: number,
    cassetteOffset: number,
    chainstayLength: number
  ): ChainlineResult {
    const optimalChainline = 50 // Standard mountain bike chainline
    const currentChainline = chainringOffset + (cassetteOffset / 2)
    const deviation = Math.abs(currentChainline - optimalChainline)
    
    // Efficiency calculation based on deviation
    const efficiency = Math.max(85, 100 - (deviation * 2))
    
    const recommendations: string[] = []
    
    if (deviation > 5) {
      recommendations.push('Consider adjusting chainring offset or bottom bracket position')
    }
    if (deviation > 10) {
      recommendations.push('Significant chainline deviation may cause premature wear')
    }
    if (deviation < 2) {
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