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
          message: `Cassette requires ${cassetteFreehub} freehub, but hub has ${hubFreehubs.join(', ')}`,
          components: [cassette.manufacturer + ' ' + cassette.model, hub.manufacturer + ' ' + hub.model],
          costToFix: 150,
          estimatedCost: 150
        })

        solutions.push({
          type: 'replace',
          component: 'freehub',
          description: 'Replace freehub body or select compatible cassette',
          estimatedCost: 150,
          components: [cassette.manufacturer + ' ' + cassette.model],
          difficulty: 'medium'
        })
      }
    }

    // Check derailleur capacity
    const derailleur = proposed.derailleur || current.derailleur
    if (cassette?.cassette && derailleur?.derailleur) {
      const largestCog = Math.max(...cassette.cassette.cogs)
      const maxCog = derailleur.derailleur.maxCog || 50

      if (largestCog > maxCog) {
        issues.push({
          type: 'capacity',
          severity: 'high',
          message: `Derailleur can't handle ${largestCog}T cog (max: ${maxCog}T)`,
          components: [derailleur.manufacturer + ' ' + derailleur.model],
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
    const currentComponents = [current.cassette, current.chainring, current.chain]
    const proposedComponents = [proposed.cassette, proposed.chainring, proposed.chain]
    
    const currentWeight = this.calculateTotalWeight(currentComponents)
    const proposedWeight = this.calculateTotalWeight(proposedComponents)
    const weightDifference = proposedWeight - currentWeight
    
    // Cost calculations
    const currentCost = this.calculateTotalCost(currentComponents)
    const proposedCost = this.calculateTotalCost(proposedComponents)
    const costDifference = proposedCost - currentCost
    
    // Compatibility check
    const compatibility = this.checkCompatibility(current, proposed)
    
    return {
      performance: {
        topSpeed: {
          current: currentTopSpeed,
          proposed: proposedTopSpeed,
          unit: 'mph' as const,
          difference: proposedTopSpeed - currentTopSpeed,
          percentage: currentTopSpeed > 0 ? ((proposedTopSpeed - currentTopSpeed) / currentTopSpeed) * 100 : 0
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
          unit: '%' as const,
          difference: proposedGearRange - currentGearRange
        },
        gearRatios: proposedGearRatios,
        efficiency: {
          crossChaining: {
            current: currentCrossChaining,
            proposed: proposedCrossChaining,
            improvement: Math.max(0, currentCrossChaining.length - proposedCrossChaining.length)
          },
          optimalGears: proposedGearRatios.slice(2, -2).map(r => r.ratio),
          efficiencyLoss: Math.max(0, proposedCrossChaining.reduce((sum, issue) => sum + issue.efficiencyLoss, 0))
        }
      },
      weight: {
        current: currentWeight,
        proposed: proposedWeight,
        difference: weightDifference,
        unit: 'g' as const,
        percentage: currentWeight > 0 ? (weightDifference / currentWeight) * 100 : 0,
        costPerGram: weightDifference !== 0 ? Math.abs(costDifference / weightDifference) : 0
      },
      compatibility,
      cost: {
        current: currentCost,
        proposed: totalProposedCost,
        difference: totalProposedCost - currentCost,
        currency: 'USD' as const,
        includesCompatibilityFixes: compatibilityCost > 0,
        breakdown: this.generateCostBreakdown(currentComponents, proposedComponents, compatibilityCost),
        upgradeValue: this.calculateUpgradeValue(weightDifference, totalProposedCost - currentCost)
      }
    }
  }

  /**
   * Generate cost breakdown
   */
  static generateCostBreakdown(
    currentComponents: (Component | undefined)[], 
    proposedComponents: (Component | undefined)[],
    compatibilityCost: number = 0
  ): CostBreakdown[] {
    const breakdown: CostBreakdown[] = []
    
    const categories = ['cassette', 'chainring', 'chain', 'wheel', 'tire']
    
    categories.forEach((category, index) => {
      const current = currentComponents[index]
      const proposed = proposedComponents[index]
      
      if (current || proposed) {
        breakdown.push({
          component: category,
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
   * Calculate upgrade value (performance per dollar)
   */
  static calculateUpgradeValue(weightSavings: number, costIncrease: number): number {
    if (costIncrease <= 0) return weightSavings > 0 ? 100 : 0
    if (weightSavings <= 0) return 0
    
    // Simple value calculation: grams saved per dollar
    return Math.round((weightSavings / costIncrease) * 100) / 100
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
    derailleurCapacity: number = 35
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
        'Always test chain length before final installation',
        'Consider derailleur capacity when sizing'
      ]
    }
  }

  /**
   * Calculate chainline analysis
   */
  static calculateChainline(
    frameChainline: number,
    crankChainline: number,
    cassetteChainline: number
  ): ChainlineResult {
    const currentChainline = (crankChainline + cassetteChainline) / 2
    const deviation = Math.abs(currentChainline - frameChainline)
    const efficiency = Math.max(0, 100 - (deviation * 2))
    
    const recommendations: string[] = []
    
    if (deviation > 2) {
      recommendations.push('Consider adjusting chainring offset or bottom bracket spacers')
    }
    if (deviation > 5) {
      recommendations.push('Large chainline deviation may cause poor shifting and increased wear')
    }
    if (efficiency > 95) {
      recommendations.push('Excellent chainline alignment')
    }
    
    return {
      optimalChainline: frameChainline,
      currentChainline,
      deviation,
      efficiency,
      recommendations
    }
  }

  /**
   * Analyze chainline - matches the function signature used in chainline page
   */
  static analyzeChainline(
    chainringOffset: number,
    cassetteOffset: number,
    chainstayLength: number
  ): ChainlineResult {
    // Calculate frame-specific optimal chainline
    const frameChainline = 42.5 // Standard MTB chainline (can be made dynamic based on frame type)
    
    // Calculate actual chainline based on component offsets
    const crankChainline = frameChainline + chainringOffset
    const cassetteChainline = frameChainline + cassetteOffset
    const actualChainline = (crankChainline + cassetteChainline) / 2
    
    // Calculate deviation and efficiency
    const deviation = Math.abs(actualChainline - frameChainline)
    const efficiency = Math.max(0, 100 - (deviation * 2))
    
    const recommendations: string[] = []
    
    // Generate specific recommendations
    if (deviation > 3) {
      recommendations.push('Significant chainline deviation detected - consider adjusting component offsets')
    }
    if (deviation > 1 && deviation <= 3) {
      recommendations.push('Minor chainline deviation - acceptable for most riding')
    }
    if (efficiency < 85) {
      recommendations.push('Poor chainline efficiency may cause increased wear and noise')
    }
    if (efficiency >= 95) {
      recommendations.push('Excellent chainline - optimal efficiency and component life')
    }
    
    // Chainstay-specific recommendations
    if (chainstayLength < 420) {
      recommendations.push('Short chainstays may require more precise chainline alignment')
    }
    if (chainstayLength > 450) {
      recommendations.push('Longer chainstays provide more chainline tolerance')
    }
    
    return {
      optimalChainline: frameChainline,
      currentChainline: actualChainline,
      deviation,
      efficiency,
      recommendations
    }
  }
}