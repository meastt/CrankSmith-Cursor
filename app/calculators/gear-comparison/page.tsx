'use client'

import { useState } from 'react'
import { GearCalculator } from '@/lib/gear-calculator'
import { BikeSetup, ComparisonResults, Component } from '@/types/gear-calculator'
import { ArrowRight, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Weight, DollarSign, Zap } from 'lucide-react'

// Sample data for demo - in real app this would come from database
const sampleComponents: Component[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
  }
]

export default function GearComparisonPage() {
  const [currentSetup, setCurrentSetup] = useState<BikeSetup>({})
  const [proposedSetup, setProposedSetup] = useState<BikeSetup>({})
  const [results, setResults] = useState<ComparisonResults | null>(null)

  const handleCompare = () => {
    try {
      const comparisonResults = GearCalculator.compareSetups(currentSetup, proposedSetup)
      setResults(comparisonResults)
    } catch (error) {
      console.error('Comparison error:', error)
    }
  }

  const getCompatibilityIcon = (status: string) => {
    switch (status) {
      case 'compatible':
        return <CheckCircle className="w-5 h-5 text-success-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-600" />
      case 'incompatible':
        return <XCircle className="w-5 h-5 text-error-600" />
      default:
        return null
    }
  }

  const getCompatibilityClass = (status: string) => {
    switch (status) {
      case 'compatible':
        return 'compatibility-success'
      case 'warning':
        return 'compatibility-warning'
      case 'incompatible':
        return 'compatibility-error'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gear Comparison Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare your current setup with any proposed changes. See speed, climbing ability, and efficiency improvements instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Setup</h2>
            <p className="text-gray-600">Component selection coming soon...</p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Proposed Setup</h2>
            <p className="text-gray-600">Component selection coming soon...</p>
          </div>
        </div>

        <div className="text-center">
          <button className="btn-primary">
            Compare Setups
          </button>
        </div>
      </div>
    </div>
  )
} 