'use client'

import { useState } from 'react'
import { Component, CompatibilityStatus, CompatibilityIssue } from '@/types/gear-calculator'
import { CheckCircle, XCircle, AlertTriangle, Info, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react'

// Sample components for demo
const sampleComponents: Component[] = [
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
  // Hubs
  {
    id: 'hub-1',
    manufacturer: 'Shimano',
    model: 'XT M8100',
    year: 2021,
    weightGrams: 380,
    msrp: 129.99,
    category: 'HUB',
    hub: {
      freehubTypes: ['SHIMANO_HG'],
      axleType: 'THRU_AXLE',
      axleWidth: 148
    }
  },
  {
    id: 'hub-2',
    manufacturer: 'DT Swiss',
    model: '350',
    year: 2022,
    weightGrams: 420,
    msrp: 89.99,
    category: 'HUB',
    hub: {
      freehubTypes: ['SHIMANO_HG', 'SRAM_XD'],
      axleType: 'THRU_AXLE',
      axleWidth: 148
    }
  },
  // Derailleurs
  {
    id: 'derailleur-1',
    manufacturer: 'Shimano',
    model: 'XT M8100',
    year: 2021,
    weightGrams: 280,
    msrp: 89.99,
    category: 'DERAILLEUR',
    derailleur: {
      speeds: 12,
      maxCog: 45,
      capacity: 35,
      cageLength: 'LONG'
    }
  },
  {
    id: 'derailleur-2',
    manufacturer: 'SRAM',
    model: 'GX Eagle',
    year: 2022,
    weightGrams: 290,
    msrp: 95.00,
    category: 'DERAILLEUR',
    derailleur: {
      speeds: 12,
      maxCog: 52,
      capacity: 42,
      cageLength: 'LONG'
    }
  }
]

interface CompatibilityCheckerProps {
  components: Component[]
}

function CompatibilityChecker({ components }: CompatibilityCheckerProps) {
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([])
  const [compatibilityResults, setCompatibilityResults] = useState<CompatibilityStatus | null>(null)

  const handleComponentSelect = (component: Component) => {
    setSelectedComponents(prev => {
      const existing = prev.find(c => c.id === component.id)
      if (existing) {
        return prev.filter(c => c.id !== component.id)
      } else {
        return [...prev, component]
      }
    })
  }

  const checkCompatibility = () => {
    if (selectedComponents.length < 2) {
      alert('Please select at least 2 components to check compatibility')
      return
    }

    // Simple compatibility logic for demo
    const issues: CompatibilityIssue[] = []
    const solutions: any[] = []

    // Check cassette/hub compatibility
    const cassette = selectedComponents.find(c => c.category === 'CASSETTE')
    const hub = selectedComponents.find(c => c.category === 'HUB')

    if (cassette && hub) {
      const cassetteFreehub = cassette.cassette?.freehubType
      const hubFreehubs = hub.hub?.freehubTypes

      if (cassetteFreehub && hubFreehubs && !hubFreehubs.includes(cassetteFreehub)) {
        issues.push({
          type: 'freehub',
          severity: 'critical',
          message: `Cassette requires ${cassetteFreehub} freehub, but hub only supports ${hubFreehubs.join(', ')}`,
          components: ['cassette', 'hub'],
          estimatedCost: 50
        })

        solutions.push({
          type: 'freehub_adapter',
          message: 'Use a freehub adapter or replace hub',
          cost: 50,
          difficulty: 'medium'
        })
      }
    }

    // Check derailleur/cassette compatibility
    const derailleur = selectedComponents.find(c => c.category === 'DERAILLEUR')

    if (derailleur && cassette) {
      const derailleurMaxCog = derailleur.derailleur?.maxCog
      const cassetteMaxCog = Math.max(...(cassette.cassette?.cogs || []))

      if (derailleurMaxCog && cassetteMaxCog > derailleurMaxCog) {
        issues.push({
          type: 'derailleur_capacity',
          severity: 'warning',
          message: `Derailleur max cog is ${derailleurMaxCog}T, but cassette has ${cassetteMaxCog}T`,
          components: ['derailleur', 'cassette'],
          estimatedCost: 0
        })
      }
    }

    setCompatibilityResults({
      isCompatible: issues.length === 0,
      issues,
      solutions,
      overallStatus: issues.length === 0 ? 'compatible' : issues.some(i => i.severity === 'critical') ? 'incompatible' : 'warning'
    })
  }

  const getCompatibilityIcon = (status: string) => {
    switch (status) {
      case 'compatible':
        return <CheckCircle className="w-6 h-6 text-success-600" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-warning-600" />
      case 'incompatible':
        return <XCircle className="w-6 h-6 text-error-600" />
      default:
        return <Info className="w-6 h-6 text-gray-600" />
    }
  }

  const getCompatibilityClass = (status: string) => {
    switch (status) {
      case 'compatible':
        return 'border-success-200 bg-success-50'
      case 'warning':
        return 'border-warning-200 bg-warning-50'
      case 'incompatible':
        return 'border-error-200 bg-error-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Component Compatibility Checker</h2>
      
      {/* Component Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Components to Check</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map(component => {
            const isSelected = selectedComponents.some(c => c.id === component.id)
            
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
                    <h4 className="font-semibold text-gray-900">
                      {component.manufacturer} {component.model}
                    </h4>
                    <p className="text-sm text-gray-600 capitalize">{component.category.toLowerCase()}</p>
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
                
                {component.hub && (
                  <div className="text-sm text-gray-600">
                    <p>Freehub: {component.hub.freehubTypes.join(', ').replace(/_/g, ' ')}</p>
                    <p>Axle: {component.hub.axleType.replace('_', ' ')} {component.hub.axleWidth}mm</p>
                  </div>
                )}
                
                {component.derailleur && (
                  <div className="text-sm text-gray-600">
                    <p>{component.derailleur.speeds} speed • Max {component.derailleur.maxCog}T</p>
                    <p>Capacity: {component.derailleur.capacity}T</p>
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
      </div>

      {/* Check Button */}
      <div className="text-center mb-8">
        <button 
          onClick={checkCompatibility}
          disabled={selectedComponents.length < 2}
          className={`btn-primary ${selectedComponents.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Check Compatibility
        </button>
      </div>

      {/* Results */}
      {compatibilityResults && (
        <div className={`border rounded-lg p-6 ${getCompatibilityClass(compatibilityResults.overallStatus)}`}>
          <div className="flex items-center mb-4">
            {getCompatibilityIcon(compatibilityResults.overallStatus)}
            <h3 className="text-xl font-bold text-gray-900 ml-3">
              {compatibilityResults.isCompatible ? 'All Components Compatible!' : 'Compatibility Issues Found'}
            </h3>
          </div>

          {compatibilityResults.issues.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Issues Found:</h4>
              <div className="space-y-3">
                {compatibilityResults.issues.map((issue, index) => (
                  <div key={index} className="p-3 bg-white rounded border">
                    <div className="flex items-start">
                      {issue.severity === 'critical' ? (
                        <XCircle className="w-5 h-5 text-error-600 mt-0.5 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5 mr-2 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{issue.message}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Components: {issue.components.join(', ')}
                        </p>
                        {issue.estimatedCost > 0 && (
                          <p className="text-sm text-gray-600">
                            Estimated cost to fix: ${issue.estimatedCost}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {compatibilityResults.solutions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Solutions:</h4>
              <div className="space-y-3">
                {compatibilityResults.solutions.map((solution, index) => (
                  <div key={index} className="p-3 bg-white rounded border">
                    <p className="font-medium text-gray-900">{solution.message}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <span>Cost: ${solution.cost}</span>
                      <span className="mx-2">•</span>
                      <span>Difficulty: {solution.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CompatibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Component Compatibility Checker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Will this cassette work with your hub? Our compatibility engine catches issues before you buy, saving you time and money.
          </p>
        </div>

        <CompatibilityChecker components={sampleComponents} />

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-success-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prevent Mistakes</h3>
            <p className="text-gray-600">Catch compatibility issues before you buy, not after you try to install.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
            <p className="text-gray-600">Get compatibility checks in seconds with our comprehensive database.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-warning-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Money</h3>
            <p className="text-gray-600">Avoid buying incompatible parts and expensive returns.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 