import { 
  GearComparison, 
  BikeSetup, 
  ComparisonResults, 
  PerformanceMetrics,
  WeightComparison,
  CompatibilityStatus,
  CostAnalysis,
  GearRatio,
  SpeedMetric,
  GearMetric,
  RangeMetric,
  EfficiencyMetrics,
  CrossChainingAnalysis,
  CrossChainingIssue,
  CompatibilityIssue,
  CompatibilitySolution,
  CostBreakdown,
  Component,
  CassetteData,
  ChainringData,
  CalculatorParams,
  TirePressureResult,
  ChainLengthResult,
  ChainlineResult
} from '@/types/gear-calculator';

// Constants
const PI = Math.PI;
const METERS_PER_INCH = 0.0254;
const MPH_TO_KPH = 1.60934;
const GRAMS_TO_OUNCES = 0.035274;

export class GearCalculator {
  /**
   * Calculate gear ratio between chainring and cog
   */
  static calculateGearRatio(chainringTeeth: number, cogTeeth: number): number {
    return chainringTeeth / cogTeeth;
  }

  /**
   * Calculate speed in mph given gear ratio, cadence, and wheel diameter
   */
  static calculateSpeed(
    chainringTeeth: number, 
    cogTeeth: number, 
    cadence: number, 
    wheelDiameter: number,
    tireWidth: number = 2.0
  ): number {
    const gearRatio = this.calculateGearRatio(chainringTeeth, cogTeeth);
    const wheelCircumference = this.calculateWheelCircumference(wheelDiameter, tireWidth);
    const distancePerRevolution = gearRatio * wheelCircumference;
    const distancePerMinute = distancePerRevolution * cadence;
    const mph = (distancePerMinute * 60) / 1609.34; // Convert to mph
    return Math.round(mph * 10) / 10;
  }

  /**
   * Calculate wheel circumference including tire
   */
  static calculateWheelCircumference(wheelDiameter: number, tireWidth: number): number {
    const effectiveDiameter = wheelDiameter + (tireWidth * 2);
    return effectiveDiameter * PI * METERS_PER_INCH;
  }

  /**
   * Calculate gear range percentage
   */
  static calculateGearRange(cassette: CassetteData, chainring: ChainringData): number {
    const smallestCog = Math.min(...cassette.cogs);
    const largestCog = Math.max(...cassette.cogs);
    const lowestGear = chainring.teeth / largestCog;
    const highestGear = chainring.teeth / smallestCog;
    return Math.round((highestGear / lowestGear - 1) * 100);
  }

  /**
   * Calculate climbing gear ratio (lowest gear)
   */
  static calculateClimbingGear(cassette: CassetteData, chainring: ChainringData): number {
    const largestCog = Math.max(...cassette.cogs);
    return Math.round((chainring.teeth / largestCog) * 100) / 100;
  }

  /**
   * Calculate top speed in highest gear
   */
  static calculateTopSpeed(
    cassette: CassetteData, 
    chainring: ChainringData, 
    cadence: number = 90,
    wheelDiameter: number = 29,
    tireWidth: number = 2.4
  ): number {
    const smallestCog = Math.min(...cassette.cogs);
    return this.calculateSpeed(chainring.teeth, smallestCog, cadence, wheelDiameter, tireWidth);
  }

  /**
   * Calculate total weight of components
   */
  static calculateTotalWeight(components: (Component | undefined)[]): number {
    return components
      .filter(comp => comp?.weightGrams)
      .reduce((total, comp) => total + (comp?.weightGrams || 0), 0);
  }

  /**
   * Calculate total cost of components
   */
  static calculateTotalCost(components: (Component | undefined)[]): number {
    return components
      .filter(comp => comp?.msrp)
      .reduce((total, comp) => total + (comp?.msrp || 0), 0);
  }

  /**
   * Generate all gear ratios for a setup
   */
  static generateGearRatios(cassette: CassetteData, chainring: ChainringData): GearRatio[] {
    return cassette.cogs.map(cog => ({
      chainring: chainring.teeth,
      cog,
      ratio: this.calculateGearRatio(chainring.teeth, cog)
    }));
  }

  /**
   * Analyze cross-chaining issues
   */
  static analyzeCrossChaining(
    cassette: CassetteData, 
    chainring: ChainringData,
    derailleurCapacity?: number
  ): CrossChainingIssue[] {
    const issues: CrossChainingIssue[] = [];
    
    // Check for extreme cross-chaining
    cassette.cogs.forEach((cog, index) => {
      const isSmallCog = cog <= 12;
      const isLargeCog = cog >= 42;
      const isOuterChainring = chainring.teeth >= 34;
      const isInnerChainring = chainring.teeth <= 28;
      
      let severity: 'low' | 'medium' | 'high' = 'low';
      let efficiencyLoss = 0;
      let recommendation = '';
      
      if (isSmallCog && isInnerChainring) {
        severity = 'high';
        efficiencyLoss = 15;
        recommendation = 'Use larger chainring for better efficiency';
      } else if (isLargeCog && isOuterChainring) {
        severity = 'medium';
        efficiencyLoss = 8;
        recommendation = 'Consider smaller chainring for climbing';
      } else if (isSmallCog && isOuterChainring) {
        // This is optimal
        efficiencyLoss = 0;
      } else if (isLargeCog && isInnerChainring) {
        // This is optimal for climbing
        efficiencyLoss = 0;
      }
      
      if (efficiencyLoss > 0) {
        issues.push({
          gear: `${chainring.teeth}T x ${cog}T`,
          severity,
          efficiencyLoss,
          recommendation
        });
      }
    });
    
    return issues;
  }

  /**
   * Check compatibility between components
   */
  static checkCompatibility(
    current: BikeSetup,
    proposed: BikeSetup
  ): CompatibilityStatus {
    const issues: CompatibilityIssue[] = [];
    const solutions: CompatibilitySolution[] = [];
    
    // Check cassette/hub compatibility
    if (proposed.cassette && current.hub) {
      const cassetteFreehub = proposed.cassette.cassette?.freehubType;
      const hubFreehubs = current.hub.hub?.freehubTypes;
      
      if (cassetteFreehub && hubFreehubs && !hubFreehubs.includes(cassetteFreehub)) {
        issues.push({
          type: 'freehub',
          severity: 'critical',
          message: `Cassette requires ${cassetteFreehub} freehub, but hub only supports ${hubFreehubs.join(', ')}`,
          components: ['cassette', 'hub'],
          costToFix: 60
        });
        
        solutions.push({
          type: 'upgrade',
          description: `Convert hub to ${cassetteFreehub} freehub`,
          cost: 60,
          effort: 'medium',
          reliability: 95
        });
      }
    }
    
    // Check derailleur capacity
    if (proposed.cassette && proposed.chainring && current.derailleur) {
      const cassetteRange = Math.max(...proposed.cassette.cassette!.cogs) - Math.min(...proposed.cassette.cassette!.cogs);
      const derailleurCapacity = current.derailleur.derailleur?.maxCapacity;
      
      if (derailleurCapacity && cassetteRange > derailleurCapacity) {
        issues.push({
          type: 'capacity',
          severity: 'high',
          message: `Derailleur capacity (${derailleurCapacity}T) insufficient for cassette range (${cassetteRange}T)`,
          components: ['cassette', 'derailleur'],
          costToFix: 150
        });
        
        solutions.push({
          type: 'replace',
          description: 'Upgrade to higher capacity derailleur',
          cost: 150,
          effort: 'medium',
          reliability: 90
        });
      }
    }
    
    // Check chain compatibility
    if (proposed.cassette && proposed.chain) {
      const cassetteSpeeds = proposed.cassette.cassette?.speeds;
      const chainSpeeds = proposed.chain.chain?.speeds;
      
      if (cassetteSpeeds && chainSpeeds && cassetteSpeeds !== chainSpeeds) {
        issues.push({
          type: 'chain',
          severity: 'medium',
          message: `Chain (${chainSpeeds}-speed) doesn't match cassette (${cassetteSpeeds}-speed)`,
          components: ['cassette', 'chain'],
          costToFix: 30
        });
        
        solutions.push({
          type: 'replace',
          description: `Replace with ${cassetteSpeeds}-speed chain`,
          cost: 30,
          effort: 'easy',
          reliability: 100
        });
      }
    }
    
    // Determine overall status
    const hasCritical = issues.some(issue => issue.severity === 'critical');
    const hasHigh = issues.some(issue => issue.severity === 'high');
    
    let status: 'compatible' | 'warning' | 'incompatible' = 'compatible';
    if (hasCritical) {
      status = 'incompatible';
    } else if (hasHigh || issues.length > 0) {
      status = 'warning';
    }
    
    const confidence = Math.max(0, 100 - (issues.length * 15));
    
    return {
      status,
      issues,
      solutions,
      confidence
    };
  }

  /**
   * Main comparison function - the heart of the two-card comparison
   */
  static compareSetups(current: BikeSetup, proposed: BikeSetup): ComparisonResults {
    // Performance calculations
    const currentCassette = current.cassette?.cassette;
    const currentChainring = current.chainring?.chainring;
    const proposedCassette = proposed.cassette?.cassette;
    const proposedChainring = proposed.chainring?.chainring;
    
    if (!currentCassette || !currentChainring || !proposedCassette || !proposedChainring) {
      throw new Error('Both current and proposed setups must have cassette and chainring data');
    }
    
    const currentTopSpeed = this.calculateTopSpeed(currentCassette, currentChainring);
    const proposedTopSpeed = this.calculateTopSpeed(proposedCassette, proposedChainring);
    
    const currentClimbingGear = this.calculateClimbingGear(currentCassette, currentChainring);
    const proposedClimbingGear = this.calculateClimbingGear(proposedCassette, proposedChainring);
    
    const currentGearRange = this.calculateGearRange(currentCassette, currentChainring);
    const proposedGearRange = this.calculateGearRange(proposedCassette, proposedChainring);
    
    const currentGearRatios = this.generateGearRatios(currentCassette, currentChainring);
    const proposedGearRatios = this.generateGearRatios(proposedCassette, proposedChainring);
    
    const currentCrossChaining = this.analyzeCrossChaining(currentCassette, currentChainring);
    const proposedCrossChaining = this.analyzeCrossChaining(proposedCassette, proposedChainring);
    
    // Weight calculations
    const currentComponents = [current.cassette, current.chainring, current.chain, current.wheel, current.tire];
    const proposedComponents = [proposed.cassette, proposed.chainring, proposed.chain, proposed.wheel, proposed.tire];
    
    const currentWeight = this.calculateTotalWeight(currentComponents);
    const proposedWeight = this.calculateTotalWeight(proposedComponents);
    
    // Cost calculations
    const currentCost = this.calculateTotalCost(currentComponents);
    const proposedCost = this.calculateTotalCost(proposedComponents);
    
    // Compatibility check
    const compatibility = this.checkCompatibility(current, proposed);
    
    // Calculate additional costs for compatibility fixes
    const compatibilityCost = compatibility.solutions.reduce((total, solution) => total + solution.cost, 0);
    const totalProposedCost = proposedCost + compatibilityCost;
    
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
    };
  }

  /**
   * Calculate cross-chaining improvement
   */
  private static calculateCrossChainingImprovement(
    current: CrossChainingIssue[],
    proposed: CrossChainingIssue[]
  ): number {
    const currentTotalLoss = current.reduce((sum, issue) => sum + issue.efficiencyLoss, 0);
    const proposedTotalLoss = proposed.reduce((sum, issue) => sum + issue.efficiencyLoss, 0);
    return Math.max(0, currentTotalLoss - proposedTotalLoss);
  }

  /**
   * Find optimal gears (efficient gear ratios)
   */
  private static findOptimalGears(gearRatios: GearRatio[]): number[] {
    // Optimal gears are typically in the middle range
    const sortedRatios = gearRatios.map((gear, index) => ({ ...gear, index })).sort((a, b) => b.ratio - a.ratio);
    const middleStart = Math.floor(sortedRatios.length * 0.3);
    const middleEnd = Math.floor(sortedRatios.length * 0.7);
    return sortedRatios.slice(middleStart, middleEnd).map(gear => gear.index);
  }

  /**
   * Calculate total efficiency loss from cross-chaining
   */
  private static calculateEfficiencyLoss(crossChainingIssues: CrossChainingIssue[]): number {
    return crossChainingIssues.reduce((total, issue) => total + issue.efficiencyLoss, 0);
  }

  /**
   * Generate cost breakdown
   */
  private static generateCostBreakdown(
    currentComponents: (Component | undefined)[],
    proposedComponents: (Component | undefined)[],
    compatibilityCost: number
  ): CostBreakdown[] {
    const breakdown: CostBreakdown[] = [];
    
    const componentTypes = ['cassette', 'chainring', 'chain', 'wheel', 'tire'];
    
    componentTypes.forEach((type, index) => {
      const current = currentComponents[index];
      const proposed = proposedComponents[index];
      
      if (current || proposed) {
        breakdown.push({
          component: type,
          currentCost: current?.msrp || 0,
          proposedCost: proposed?.msrp || 0,
          difference: (proposed?.msrp || 0) - (current?.msrp || 0)
        });
      }
    });
    
    if (compatibilityCost > 0) {
      breakdown.push({
        component: 'compatibility_fixes',
        currentCost: 0,
        proposedCost: compatibilityCost,
        difference: compatibilityCost
      });
    }
    
    return breakdown;
  }

  /**
   * Calculate tire pressure based on rider weight and terrain
   */
  static calculateTirePressure(params: CalculatorParams): TirePressureResult {
    const { riderWeight, bikeWeight, tireWidth, terrain, tubeless } = params;
    const totalWeight = riderWeight + bikeWeight;
    
    // Base pressure calculation (simplified)
    let basePressure = (totalWeight * 0.4) / tireWidth;
    
    // Adjust for terrain
    const terrainMultipliers = {
      road: 1.2,
      gravel: 1.0,
      trail: 0.8,
      downhill: 0.6
    };
    
    basePressure *= terrainMultipliers[terrain];
    
    // Adjust for tubeless
    if (tubeless) {
      basePressure *= 0.9;
    }
    
    // Front/rear pressure difference
    const frontPSI = Math.round(basePressure * 0.9);
    const rearPSI = Math.round(basePressure);
    
    const range = {
      min: Math.round(basePressure * 0.8),
      max: Math.round(basePressure * 1.2)
    };
    
    const notes = [
      `Based on ${totalWeight}lb total weight`,
      `${terrain} terrain adjustment applied`,
      tubeless ? 'Tubeless setup - reduced pressure' : 'Tubed setup'
    ];
    
    const recommendations = [
      'Start with these pressures and adjust based on feel',
      'Lower pressure for better traction on loose terrain',
      'Higher pressure for better rolling efficiency on smooth surfaces'
    ];
    
    return {
      frontPSI,
      rearPSI,
      range,
      notes,
      recommendations
    };
  }

  /**
   * Calculate chain length
   */
  static calculateChainLength(
    chainringTeeth: number,
    cassetteLargestCog: number,
    chainstayLength: number,
    derailleurCapacity?: number
  ): ChainLengthResult {
    // Simplified chain length calculation
    const chainstayInches = chainstayLength / 25.4; // Convert mm to inches
    const chainstayLinks = Math.round(chainstayInches * 2);
    const chainringLinks = Math.round(chainringTeeth / 4);
    const cassetteLinks = Math.round(cassetteLargestCog / 4);
    const derailleurLinks = derailleurCapacity ? Math.round(derailleurCapacity / 8) : 4;
    
    const links = chainstayLinks + chainringLinks + cassetteLinks + derailleurLinks;
    const length = links * 12.7; // 12.7mm per link
    
    const tolerance = {
      min: links - 2,
      max: links + 2
    };
    
    const notes = [
      `Chainstay: ${chainstayLength}mm`,
      `Largest cog: ${cassetteLargestCog}T`,
      `Chainring: ${chainringTeeth}T`
    ];
    
    return {
      links,
      length,
      tolerance,
      notes
    };
  }

  /**
   * Analyze chainline
   */
  static analyzeChainline(
    chainringOffset: number,
    cassetteOffset: number,
    chainstayLength: number
  ): ChainlineResult {
    const optimalChainline = chainstayLength / 2; // Center of cassette
    const currentChainline = chainringOffset;
    const deviation = Math.abs(currentChainline - optimalChainline);
    
    const efficiency = Math.max(0, 100 - (deviation * 2)); // 2% loss per mm deviation
    
    const recommendations = [];
    if (deviation > 2) {
      recommendations.push('Consider adjusting chainring offset');
    }
    if (deviation > 5) {
      recommendations.push('Chainline deviation may cause premature wear');
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