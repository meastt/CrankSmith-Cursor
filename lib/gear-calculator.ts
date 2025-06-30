// lib/gear-calculator.ts - CORRECTED AND EXPANDED

import { 
  BikeSetup, 
  ComparisonResults, 
  Component,
  CompatibilityStatus,
  CompatibilityIssue,
  GearRatio,
  ChainLengthResult,
  ChainlineResult,
  PerformanceMetrics,
  WeightComparison,
  CostAnalysis,
  SpeedMetric,
  GearMetric,
  RangeMetric,
  CalculatorParams,
} from '@/types/gear-calculator'

export class GearCalculator {

  // Helper to get chainring teeth from either chainring or crankset component
  private static getChainringTeeth(setup: BikeSetup): number {
    if (setup.chainring?.chainring?.teeth) {
      return setup.chainring.chainring.teeth;
    }
    if (setup.crankset?.crankset?.chainrings && setup.crankset.crankset.chainrings.length > 0) {
      // For 1x setups, take the first/only chainring
      return setup.crankset.crankset.chainrings[0];
    }
    return 0;
  }
  
  /**
   * Main comparison function - compares two complete setups
   */
  static compareSetups(current: BikeSetup, proposed: BikeSetup, params: CalculatorParams): ComparisonResults {
    const performance = this.calculatePerformanceMetrics(current, proposed, params);
    const weight = this.calculateWeightComparison(current, proposed);
    
    // Chainline and Chain Length need to be calculated before compatibility
    const proposedChainringTeeth = this.getChainringTeeth(proposed);
    const proposedLargestCog = proposed.cassette?.cassette ? Math.max(...proposed.cassette.cassette.cogs) : 0;
    
    const chainLength = this.calculateChainLength(
      proposedChainringTeeth,
      proposedLargestCog,
      params.chainstayLength || 430 // Default chainstay length if not provided
    );

    const chainline = this.analyzeChainline(
      proposed.crankset?.crankset?.offset || 0,
      0, // Assuming cassette center is 0 for simplicity
      params.chainstayLength || 430
    );

    const compatibility = this.checkCompatibility(current, proposed, chainline);
    const cost = this.calculateCostAnalysis(current, proposed, compatibility);

    return {
      performance,
      weight,
      compatibility,
      cost,
      chainLength,
      chainline
    };
  }

  static calculatePerformanceMetrics(current: BikeSetup, proposed: BikeSetup, params: CalculatorParams): PerformanceMetrics {
    const { wheelDiameter = 29, cadence = 90 } = params;

    const currentChainringTeeth = this.getChainringTeeth(current);
    const proposedChainringTeeth = this.getChainringTeeth(proposed);

    const currentTopSpeed = this.calculateTopSpeed(current.cassette, currentChainringTeeth, wheelDiameter, cadence);
    const proposedTopSpeed = this.calculateTopSpeed(proposed.cassette, proposedChainringTeeth, wheelDiameter, cadence);
    
    const currentClimbingGear = this.calculateClimbingGear(current.cassette, currentChainringTeeth);
    const proposedClimbingGear = this.calculateClimbingGear(proposed.cassette, proposedChainringTeeth);
    
    const currentGearRange = this.calculateGearRange(current.cassette, currentChainringTeeth);
    const proposedGearRange = this.calculateGearRange(proposed.cassette, proposedChainringTeeth);

    const topSpeed: SpeedMetric = {
      current: currentTopSpeed,
      proposed: proposedTopSpeed,
      unit: 'mph',
      difference: Math.round((proposedTopSpeed - currentTopSpeed) * 10) / 10,
      percentage: currentTopSpeed > 0 ? Math.round(((proposedTopSpeed - currentTopSpeed) / currentTopSpeed) * 100) : 0
    };

    const climbingGear: GearMetric = {
      current: currentClimbingGear,
      proposed: proposedClimbingGear,
      unit: 'ratio',
      difference: Math.round((proposedClimbingGear - currentClimbingGear) * 100) / 100
    };

    const gearRange: RangeMetric = {
      current: currentGearRange,
      proposed: proposedGearRange,
      unit: '%',
      difference: proposedGearRange - currentGearRange
    };

    const gearRatios = this.generateGearRatios(proposed.cassette, proposedChainringTeeth);

    return {
      topSpeed,
      climbingGear,
      gearRange,
      gearRatios,
      efficiency: { crossChaining: { current: [], proposed: [], improvement: 0 }, optimalGears: [], efficiencyLoss: 0 } // Placeholder
    };
  }
  
  static calculateTopSpeed(cassetteComp: Component | undefined, chainringTeeth: number, wheelDiameter: number, cadence: number): number {
    if (!cassetteComp?.cassette?.cogs || !chainringTeeth) return 0;
    const smallestCog = Math.min(...cassetteComp.cassette.cogs);
    const gearRatio = chainringTeeth / smallestCog;
    const wheelCircumference = wheelDiameter * Math.PI;
    const speedMph = (gearRatio * wheelCircumference * cadence * 60) / 63360;
    return Math.round(speedMph * 10) / 10;
  }

  static calculateClimbingGear(cassetteComp: Component | undefined, chainringTeeth: number): number {
    if (!cassetteComp?.cassette?.cogs || !chainringTeeth) return 0;
    const largestCog = Math.max(...cassetteComp.cassette.cogs);
    return Math.round((chainringTeeth / largestCog) * 100) / 100;
  }

  static calculateGearRange(cassetteComp: Component | undefined, chainringTeeth: number): number {
    if (!cassetteComp?.cassette?.cogs || !chainringTeeth) return 0;
    const largestCog = Math.max(...cassetteComp.cassette.cogs);
    const smallestCog = Math.min(...cassetteComp.cassette.cogs);
    return Math.round(((largestCog / smallestCog) - 1) * 100);
  }

  static generateGearRatios(cassetteComp: Component | undefined, chainringTeeth: number): GearRatio[] {
    if (!cassetteComp?.cassette?.cogs || !chainringTeeth) return [];
    return cassetteComp.cassette.cogs.map(cog => ({
      chainring: chainringTeeth,
      cog: cog,
      ratio: Math.round((chainringTeeth / cog) * 100) / 100
    })).sort((a, b) => b.ratio - a.ratio);
  }

  static calculateTotalWeight(setup: BikeSetup): number {
    const components = [setup.cassette, setup.chainring, setup.crankset, setup.chain, setup.wheel, setup.tire, setup.derailleur, setup.hub];
    return components.reduce((total, component) => total + (component?.weightGrams || 0), 0);
  }
  
  static calculateWeightComparison(current: BikeSetup, proposed: BikeSetup): WeightComparison {
    const currentWeight = this.calculateTotalWeight(current);
    const proposedWeight = this.calculateTotalWeight(proposed);
    const difference = proposedWeight - currentWeight;
    return {
      current: currentWeight,
      proposed: proposedWeight,
      difference,
      unit: 'g',
      percentage: currentWeight > 0 ? Math.round((difference / currentWeight) * 100) : 0,
    };
  }

  static calculateTotalCost(setup: BikeSetup): number {
    const components = [setup.cassette, setup.chainring, setup.crankset, setup.chain, setup.wheel, setup.tire, setup.derailleur, setup.hub];
    return components.reduce((total, component) => total + (component?.msrp || 0), 0);
  }

  static calculateCostAnalysis(current: BikeSetup, proposed: BikeSetup, compatibility: CompatibilityStatus): CostAnalysis {
    const currentCost = this.calculateTotalCost(current);
    const proposedCost = this.calculateTotalCost(proposed);
    const compatibilityCost = compatibility.issues.reduce((total, issue) => total + (issue.costToFix || 0), 0);
    const totalProposedCost = proposedCost + compatibilityCost;
    return {
      current: currentCost,
      proposed: totalProposedCost,
      difference: totalProposedCost - currentCost,
      currency: 'USD',
      includesCompatibilityFixes: compatibilityCost > 0,
      breakdown: [
        { component: 'Components', currentCost, proposedCost, difference: proposedCost - currentCost },
        { component: 'Compatibility Fixes', currentCost: 0, proposedCost: compatibilityCost, difference: compatibilityCost }
      ]
    };
  }

  static checkCompatibility(current: BikeSetup, proposed: BikeSetup, chainline: ChainlineResult): CompatibilityStatus {
    const issues: CompatibilityIssue[] = [];
    
    // Check BCD compatibility if both chainring and crankset are selected
    if (proposed.chainring && proposed.crankset) {
      const ringBcd = proposed.chainring.chainring?.bcd;
      const crankBcd = proposed.crankset.crankset?.bcd;
      if (ringBcd && crankBcd && ringBcd !== crankBcd) {
        issues.push({
          type: 'bcd',
          severity: 'critical',
          message: `Chainring BCD (${ringBcd}mm) does not match crankset BCD (${crankBcd}mm).`,
          components: [`${proposed.chainring.manufacturer} ${proposed.chainring.model}`, `${proposed.crankset.manufacturer} ${proposed.crankset.model}`],
          estimatedCost: proposed.chainring.msrp || 50,
        });
      }
    }

    // Check chainline deviation
    if (Math.abs(chainline.deviation) > 3) {
      issues.push({
        type: 'chainline',
        severity: 'medium',
        message: `Chainline deviation is ${chainline.deviation.toFixed(1)}mm, which may cause noise and premature wear.`,
        components: ['Drivetrain'],
        estimatedCost: 20 // Cost for spacers or adjustment
      });
    }

    // Existing checks (cassette, derailleur, etc.) would go here
    
    return {
      isCompatible: issues.length === 0,
      status: issues.length > 0 ? (issues.some(i => i.severity === 'critical') ? 'incompatible' : 'warning') : 'compatible',
      overallStatus: issues.length > 0 ? (issues.some(i => i.severity === 'critical') ? 'incompatible' : 'warning') : 'compatible',
      issues,
      solutions: [],
      confidence: 100 - (issues.length * 20)
    };
  }

  static calculateChainLength(largestChainring: number, largestCog: number, chainstayLength: number): ChainLengthResult {
    if (!largestChainring || !largestCog || !chainstayLength) {
        return { links: 0, length: 0, tolerance: {min: 0, max: 0}, notes: ['Missing inputs for calculation.'] };
    }
    const baseLength = (2 * (chainstayLength / 25.4)) + (largestChainring / 4) + (largestCog / 4);
    const links = Math.ceil(baseLength + 1) * 2; // +1 inch, then round to nearest full link (2 links)
    const finalLinks = links % 2 === 0 ? links : links + 1;
    
    return {
      links: finalLinks,
      length: Math.round(finalLinks * 12.7),
      tolerance: { min: finalLinks - 2, max: finalLinks + 2 },
      notes: [
        'Formula: ((2 x Chainstay) + (Chainring/4) + (Cog/4)) + 1 inch.',
        'Always test chain in largest cog and largest chainring before cutting.'
      ]
    };
  }
  
  static analyzeChainline(chainringOffset: number, cassetteCenter: number, chainstayLength: number): ChainlineResult {
    const currentChainline = Math.abs(chainringOffset - cassetteCenter);
    const optimalChainline = 0; // Ideal is perfect alignment
    const deviation = currentChainline - optimalChainline;
    const efficiency = Math.max(90, 100 - (Math.abs(deviation) * 2)); // 2% loss per mm deviation, capped at 90%
    const recommendations: string[] = [];
    if (Math.abs(deviation) > 5) {
      recommendations.push('Significant deviation detected. Consider chainring spacers or a different crankset.');
    } else if (Math.abs(deviation) > 2) {
      recommendations.push('Minor deviation. Performance is likely acceptable, but could be optimized.');
    } else {
      recommendations.push('Excellent chainline alignment.');
    }
    return {
      optimalChainline,
      currentChainline,
      deviation,
      efficiency,
      recommendations
    };
  }
}