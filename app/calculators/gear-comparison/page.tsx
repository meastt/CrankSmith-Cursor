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
    
    // Update setup based on component category
    switch (component.category) {
      case 'CASSETTE':
        newSetup.cassette = component
        break
      case 'CHAINRING':
        newSetup.chainring = component
        break
      case 'CRANKSET':
        newSetup.chainring = component // Crankset acts as chainring for calculations
        break
      case 'CHAIN':
        newSetup.chain = component
        break
      case 'WHEEL':
        newSetup.wheel = component
        break
      case 'TIRE':
        newSetup.tire = component
        break
      case 'DERAILLEUR':
        newSetup.derailleur = component
        break
      case 'HUB':
        newSetup.hub = component
        break
      default:
        break
    }
    
    onSetupChange(newSetup)
  }

  const getSelectedComponent = () => {
    switch (selectedCategory) {
      case 'CASSETTE':
        return setup.cassette
      case 'CHAINRING':
        return setup.chainring
      case 'CRANKSET':
        return setup.chainring // Crankset acts as chainring
      case 'CHAIN':
        return setup.chain
      case 'WHEEL':
        return setup.wheel
      case 'TIRE':
        return setup.tire
      case 'DERAILLEUR':
        return setup.derailleur
      case 'HUB':
        return setup.hub
      default:
        return null
    }
  }

  const selectedComponent = getSelectedComponent()

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {/* Category Selector */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Component Display */}
      {selectedComponent && (
        <div className="mb-4 p-3 bg-primary-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {selectedComponent.manufacturer} {selectedComponent.model}
              </p>
              <p className="text-sm text-gray-600">
                {selectedComponent.weightGrams}g • ${selectedComponent.msrp}
              </p>
            </div>
            <CheckCircle className="w-5 h-5 text-primary-600" />
          </div>
        </div>
      )}

      {/* Component List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredComponents.map((component) => {
          const isSelected = selectedComponent?.id === component.id
          
          return (
            <div
              key={component.id}
              onClick={() => handleComponentSelect(component)}
              className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {component.manufacturer} {component.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    {component.weightGrams}g • ${component.msrp}
                  </p>
                  {/* Category-specific details */}
                  {component.cassette && (
                    <p className="text-xs text-gray-500">
                      {component.cassette.speeds}-speed • {component.cassette.cogs[0]}-{component.cassette.cogs[component.cassette.cogs.length - 1]}T
                    </p>
                  )}
                  {component.chainring && (
                    <p className="text-xs text-gray-500">
                      {component.chainring.teeth}T • {component.chainring.bcd}mm BCD
                    </p>
                  )}
                  {component.crankset && (
                    <p className="text-xs text-gray-500">
                      {component.crankset.chainrings.join('/')}T • {component.crankset.spindleType}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ComparisonResults({ results }: { results: ComparisonResults | null }) {
  if (!results) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Select components to see comparison results</p>
      </div>
    )
  }

  const { performance, weight, compatibility, cost } = results

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 text-primary-600 mr-2" />
          Performance
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Top Speed */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {performance.topSpeed.difference > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : performance.topSpeed.difference < 0 ? (
                <TrendingDown className="w-5 h-5 text-red-600" />
              ) : (
                <Minus className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {performance.topSpeed.proposed} {performance.topSpeed.unit}
            </p>
            <p className="text-sm text-gray-600">Top Speed</p>
            <p className={`text-xs ${
              performance.topSpeed.difference > 0 ? 'text-green-600' : 
              performance.topSpeed.difference < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {performance.topSpeed.difference > 0 ? '+' : ''}{performance.topSpeed.difference} {performance.topSpeed.unit}
            </p>
          </div>

          {/* Climbing Gear */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {performance.climbingGear.difference < 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : performance.climbingGear.difference > 0 ? (
                <TrendingDown className="w-5 h-5 text-red-600" />
              ) : (
                <Minus className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {performance.climbingGear.proposed}
            </p>
            <p className="text-sm text-gray-600">Climbing Gear</p>
            <p className={`text-xs ${
              performance.climbingGear.difference < 0 ? 'text-green-600' : 
              performance.climbingGear.difference > 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {performance.climbingGear.difference > 0 ? '+' : ''}{performance.climbingGear.difference}
            </p>
          </div>

          {/* Gear Range */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {performance.gearRange.difference > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : performance.gearRange.difference < 0 ? (
                <TrendingDown className="w-5 h-5 text-red-600" />
              ) : (
                <Minus className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {performance.gearRange.proposed}{performance.gearRange.unit}
            </p>
            <p className="text-sm text-gray-600">Gear Range</p>
            <p className={`text-xs ${
              performance.gearRange.difference > 0 ? 'text-green-600' : 
              performance.gearRange.difference < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {performance.gearRange.difference > 0 ? '+' : ''}{performance.gearRange.difference}{performance.gearRange.unit}
            </p>
          </div>
        </div>
      </div>

      {/* Weight & Cost */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weight */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Weight className="w-5 h-5 text-primary-600 mr-2" />
            Weight
          </h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {weight.proposed}{weight.unit}
            </p>
            <p className={`text-sm ${
              weight.difference < 0 ? 'text-green-600' : 
              weight.difference > 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {weight.difference > 0 ? '+' : ''}{weight.difference}g vs current
            </p>
          </div>
        </div>

        {/* Cost */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 text-primary-600 mr-2" />
            Cost
          </h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              ${cost.proposed}
            </p>
            <p className={`text-sm ${
              cost.difference > 0 ? 'text-red-600' : 
              cost.difference < 0 ? 'text-green-600' : 'text-gray-600'
            }`}>
              {cost.difference > 0 ? '+' : ''}${cost.difference} vs current
            </p>
          </div>
        </div>
      </div>

      {/* Compatibility */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          {compatibility.isCompatible ? (
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 mr-2" />
          )}
          Compatibility
        </h3>
        
        {compatibility.isCompatible ? (
          <p className="text-green-600">All components are compatible!</p>
        ) : (
          <div className="space-y-3">
            {compatibility.issues.map((issue, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">{issue.message}</p>
                    <p className="text-red-600 text-sm">
                      Estimated fix cost: ${issue.estimatedCost}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function GearComparisonPage() {
  const [currentSetup, setCurrentSetup] = useState<BikeSetup>({})
  const [proposedSetup, setProposedSetup] = useState<BikeSetup>({})
  const [results, setResults] = useState<ComparisonResults | null>(null)

  const handleCompare = () => {
    if (!currentSetup.cassette || !currentSetup.chainring || 
        !proposedSetup.cassette || !proposedSetup.chainring) {
      alert('Please select both cassette and chainring for current and proposed setups')
      return
    }

    const comparisonResults = GearCalculator.compareSetups(currentSetup, proposedSetup)
    setResults(comparisonResults)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Gear Comparison Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare your current drivetrain with any proposed changes. See performance, weight, and compatibility differences instantly.
          </p>
        </div>

        {/* Component Selection */}
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

        {/* Compare Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCompare}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Compare Setups
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Results */}
        <ComparisonResults results={results} />
      </div>
    </div>
  )
}