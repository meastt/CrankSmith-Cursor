import { Component } from '@/types/gear-calculator'

export const sampleComponents: Component[] = [
  // Cassettes
  {
    id: 'cassette-1',
    manufacturer: 'Shimano',
    model: 'XT M8100',
    year: 2021,
    weightGrams: 420,
    msrp: 89.99,
    category: 'CASSETTE',
    cassette: {
      speeds: 12,
      cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 40, 45],
      freehubType: 'SHIMANO_HG'
    }
  },
  {
    id: 'cassette-2',
    manufacturer: 'SRAM',
    model: 'GX Eagle',
    year: 2022,
    weightGrams: 390,
    msrp: 95.00,
    category: 'CASSETTE',
    cassette: {
      speeds: 12,
      cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 52],
      freehubType: 'SRAM_XD'
    }
  },
  {
    id: 'cassette-3',
    manufacturer: 'Shimano',
    model: 'SLX M7100',
    year: 2021,
    weightGrams: 480,
    msrp: 69.99,
    category: 'CASSETTE',
    cassette: {
      speeds: 12,
      cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 40, 45],
      freehubType: 'SHIMANO_HG'
    }
  },

  // Chainrings
  {
    id: 'chainring-1',
    manufacturer: 'Race Face',
    model: 'Turbine R',
    year: 2021,
    weightGrams: 125,
    msrp: 89.99,
    category: 'CHAINRING',
    chainring: {
      teeth: 32,
      bcd: 104,
      offset: 6
    }
  },
  {
    id: 'chainring-2',
    manufacturer: 'Race Face',
    model: 'Turbine R',
    year: 2021,
    weightGrams: 135,
    msrp: 89.99,
    category: 'CHAINRING',
    chainring: {
      teeth: 34,
      bcd: 104,
      offset: 6
    }
  },
  {
    id: 'chainring-3',
    manufacturer: 'SRAM',
    model: 'X-Sync 2',
    year: 2022,
    weightGrams: 120,
    msrp: 79.99,
    category: 'CHAINRING',
    chainring: {
      teeth: 30,
      bcd: 104,
      offset: 6
    }
  },

  // Chains
  {
    id: 'chain-1',
    manufacturer: 'Shimano',
    model: 'XT M8100',
    year: 2021,
    weightGrams: 250,
    msrp: 29.99,
    category: 'CHAIN',
    chain: {
      speeds: 12,
      material: 'Steel',
      links: 126
    }
  },
  {
    id: 'chain-2',
    manufacturer: 'SRAM',
    model: 'GX Eagle',
    year: 2022,
    weightGrams: 245,
    msrp: 34.99,
    category: 'CHAIN',
    chain: {
      speeds: 12,
      material: 'Steel',
      links: 126
    }
  },

  // Wheels
  {
    id: 'wheel-1',
    manufacturer: 'DT Swiss',
    model: 'M1900',
    year: 2021,
    weightGrams: 1850,
    msrp: 299.99,
    category: 'WHEEL',
    wheel: {
      diameter: 29,
      width: 30,
      material: 'Aluminum',
      spokeCount: 32
    }
  },
  {
    id: 'wheel-2',
    manufacturer: 'Industry Nine',
    model: 'Enduro S',
    year: 2022,
    weightGrams: 1650,
    msrp: 899.99,
    category: 'WHEEL',
    wheel: {
      diameter: 29,
      width: 35,
      material: 'Carbon',
      spokeCount: 28
    }
  },

  // Tires
  {
    id: 'tire-1',
    manufacturer: 'Maxxis',
    model: 'Minion DHF',
    year: 2021,
    weightGrams: 1050,
    msrp: 69.99,
    category: 'TIRE',
    tire: {
      width: 2.5,
      diameter: 29,
      compound: '3C MaxxTerra',
      casing: 'EXO+',
      tpi: 60
    }
  },
  {
    id: 'tire-2',
    manufacturer: 'Continental',
    model: 'Mountain King',
    year: 2022,
    weightGrams: 950,
    msrp: 59.99,
    category: 'TIRE',
    tire: {
      width: 2.4,
      diameter: 29,
      compound: 'BlackChili',
      casing: 'Protection',
      tpi: 67
    }
  }
]

export const sampleProBikes = [
  {
    id: 'pro-1',
    riderName: 'Nino Schurter',
    team: 'Scott-SRAM MTB Racing',
    year: 2023,
    bikeModel: 'Scott Spark RC',
    components: {
      cassette: 'cassette-2',
      chainring: 'chainring-2',
      chain: 'chain-2',
      wheel: 'wheel-2',
      tire: 'tire-1'
    },
    verified: true
  },
  {
    id: 'pro-2',
    riderName: 'Mathieu van der Poel',
    team: 'Alpecin-Deceuninck',
    year: 2023,
    bikeModel: 'Canyon Lux',
    components: {
      cassette: 'cassette-1',
      chainring: 'chainring-1',
      chain: 'chain-1',
      wheel: 'wheel-1',
      tire: 'tire-2'
    },
    verified: true
  }
] 