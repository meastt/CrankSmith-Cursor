'use client'

import { useState } from 'react'
import { GearCalculator } from '@/lib/gear-calculator'
import { BikeSetup, ComparisonResults, Component } from '@/types/gear-calculator'
import { ArrowRight, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Weight, DollarSign, Zap, Plus, Minus, Settings, Bike } from 'lucide-react'

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
  },
  {
    id: '5',
    manufacturer: 'Shimano',
    model: 'XT M8100',
    year: 2021,
    weightGrams: 280,
    msrp: 129.99,
    category: 'CRANKSET',
    crankset: {
      chainrings: [32, 24],
      bcd: 104,
      spindleType: 'HOLLOWTECH_II'
    }
  },
  {
    id: '6',
    manufacturer: 'SRAM',
    model: 'GX Eagle',
    year: 2022,
    weightGrams: 310,
    msrp: 145.00,
    category: 'CRANKSET',
    crankset: {
      chainrings: [34, 24],
      bcd: 104,
      spindleType: 'DUB'
    }
  }
]

interface ComponentSelectorProps {
  title: string
  setup: BikeSetup
  onSetupChange: (setup: BikeSetup) => void
  components: Component[]
}

function ComponentSelector({ title, setup, onSetupChange, components }: ComponentSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('CASSETTE')
  
  const categories = ['CASSETTE', 'CHAINRING', 'CRANKSET']
  
  // FIXED: Complete the filteredComponents logic
  const filteredComponents = components.filter(comp => comp.category === selectedCategory)
  
  const handleComponentSelect = (component: Component) => {
    const newSetup = { ...setup }
    
    switch (component.category) {
      case 'CASSETTE':
        newSetup.cassette = component
        break
      case 'CHAINRING':
        newSetup.chainring = component
        break
      case 'CRANKSET':
        newSetup.crankset = component
        break
    }
    
    onSetupChange(newSetup)
  }
  
  const getSelectedComponent = (category: string) => {
    switch (category) {
      case 'CASSETTE':
        return setup.cassette
      case 'CHAINRING':
        return setup.chainring
      case 'CRANKSET':
        return setup.crankset
      default:
        return null
    }
  }

  return (
    <div className="card h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      
      {/* Category Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              selectedCategory === category
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {category.charAt(0) + category.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
      
      {/* Component List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredComponents.map(component => {
          const isSelected = getSelectedComponent(component.category)?.id === component.id
          
          return (
            <div
              key={component.id}
              onClick={() => handleComponentSelect(component)}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {component.manufacturer} {component.model}
                  </h3>
                  <p className="text-sm text-gray-600">{component.year}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${component.msrp}</p>
                  <p className="text-sm text-gray-600">{component.weightGrams}g</p>
                </div>
              </div>
              
              {/* Component-specific details */}
              {component.cassette && (
                <div className="text-sm text-gray-600">
                  <p>{component.cassette.speeds} speed • {component.cassette.cogs.join(', ')}T</p>
                  <p>Freehub: {component.cassette.freehubType.replace('_', ' ')}</p>
                </div>
              )}
              
              {component.chainring && (
                <div className="text-sm text-gray-600">
                  <p>{component.chainring.teeth}T • BCD {component.chainring.bcd}mm</p>
                  <p>Offset: {component.chainring.offset}mm</p>
                </div>
              )}
              
              {component.crankset && (
                <div className="text-sm text-gray-600">
                  <p>{component.crankset.chainrings.join('T/')}T • BCD {component.crankset.bcd}mm</p>
                  <p>Spindle: {component.crankset.spindleType.replace('_', ' ')}</p>
                </div>
              )}
              
              {isSelected && (
                <div className="mt-2 flex items-center text-primary-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Selected</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Setup Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Setup Summary</h3>
        <div className="space-y-2 text-sm">
          {setup.cassette && (
            <div className="flex justify-between">
              <span className="text-gray-600">Cassette:</span>
              <span className="font-medium">{setup.cassette.manufacturer} {setup.cassette.model}</span>
            </div>
          )}
          {setup.chainring && (
            <div className="flex justify-between">
              <span className="text-gray-600">Chainring:</span>
              <span className="font-medium">{setup.chainring.manufacturer} {setup.chainring.model}</span>
            </div>
          )}
          {setup.crankset && (
            <div className="flex justify-between">
              <span className="text-gray-600">Crankset:</span>
              <span className="font-medium">{setup.crankset.manufacturer} {setup.crankset.model}</span>
            </div>
          )}
          {!setup.cassette && !setup.chainring && !setup.crankset && (
            <p className="text-gray-500 italic">No components selected</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GearComparisonPage() {
  const [currentSetup, setCurrentSetup] = useState<BikeSetup>({})
  const [proposedSetup, setProposedSetup] = useState<BikeSetup>({})
  const [results, setResults] = useState<ComparisonResults | null>(null)
  const [isComparing, setIsComparing] = useState(false)

  const handleCompare = () => {
    if (!currentSetup.cassette || !proposedSetup.cassette) {
      alert('Please select cassettes for both setups to compare')
      return
    }
    
    setIsComparing(true)
    
    try {
      const comparisonResults = GearCalculator.compareSetups(currentSetup, proposedSetup)
      setResults(comparisonResults)
    } catch (error) {
      console.error('Comparison error:', error)
      alert('Error comparing setups. Please check your component selections.')
    } finally {
      setIsComparing(false)
    }
  }

  const canCompare = currentSetup.cassette && proposedSetup.cassette

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
          <ComponentSelector
            title="Current Setup"
            setup={currentSetup}
            onSetupChange={setCurrentSetup}
            components={sampleComponents}
          />

          <ComponentSelector
            title="Proposed Setup"
            setup={proposedSetup}
            onSetupChange={setProposedSetup}
            components={sampleComponents}
          />
        </div>

        <div className="text-center mb-12">
          <button 
            onClick={handleCompare}
            disabled={!canCompare || isComparing}
            className={`btn-primary ${!canCompare ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isComparing ? 'Comparing...' : 'Compare Setups'}
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comparison Results</h2>
            
            {/* Performance Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Top Speed</h3>
                <p className="text-2xl font-bold text-primary-600">
                  {results.performance.topSpeed.proposed.toFixed(1)} mph
                </p>
                <p className="text-sm text-gray-600">
                  {results.performance.topSpeed.difference > 0 ? '+' : ''}{results.performance.topSpeed.difference.toFixed(1)} mph change
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Climbing Gear</h3>
                <p className="text-2xl font-bold text-primary-600">
                  {results.performance.climbingGear.proposed.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  {results.performance.climbingGear.difference > 0 ? '+' : ''}{results.performance.climbingGear.difference.toFixed(2)} ratio change
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Gear Range</h3>
                <p className="text-2xl font-bold text-primary-600">
                  {results.performance.gearRange.proposed}%
                </p>
                <p className="text-sm text-gray-600">
                  {results.performance.gearRange.difference > 0 ? '+' : ''}{results.performance.gearRange.difference}% change
                </p>
              </div>
            </div>
            
            {/* Weight and Cost Analysis */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Weight Analysis</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Current:</span>
                    <span>{results.weight.current}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Proposed:</span>
                    <span>{results.weight.proposed}g</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Difference:</span>
                    <span className={results.weight.difference > 0 ? 'text-red-600' : 'text-green-600'}>
                      {results.weight.difference > 0 ? '+' : ''}{results.weight.difference}g
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Cost Analysis</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Current:</span>
                    <span>${results.cost.current.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Proposed:</span>
                    <span>${results.cost.proposed.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Difference:</span>
                    <span className={results.cost.difference > 0 ? 'text-red-600' : 'text-green-600'}>
                      {results.cost.difference > 0 ? '+' : ''}${results.cost.difference.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Compatibility Status */}
            <div className="p-4 rounded-lg" style={{
              backgroundColor: results.compatibility.status === 'compatible' ? '#f0f9ff' : 
                             results.compatibility.status === 'warning' ? '#fffbeb' : '#fef2f2'
            }}>
              <div className="flex items-center mb-2">
                {results.compatibility.status === 'compatible' && <CheckCircle className="w-5 h-5 text-green-600 mr-2" />}
                {results.compatibility.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />}
                {results.compatibility.status === 'incompatible' && <XCircle className="w-5 h-5 text-red-600 mr-2" />}
                <h3 className="font-semibold text-gray-900">
                  Compatibility: {results.compatibility.status.charAt(0).toUpperCase() + results.compatibility.status.slice(1)}
                </h3>
              </div>
              
              {results.compatibility.issues.length > 0 && (
                <div className="space-y-1">
                  {results.compatibility.issues.map((issue, index) => (
                    <p key={index} className="text-sm text-gray-700">• {issue.message}</p>
                  ))}
                </div>
              )}
              
              {results.compatibility.issues.length === 0 && (
                <p className="text-sm text-gray-700">All components are compatible with each other.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}