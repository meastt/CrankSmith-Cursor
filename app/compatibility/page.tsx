'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Shield, 
  Zap, 
  TrendingUp 
} from 'lucide-react'
import { Component, ComponentCategory, CompatibilityStatus, CompatibilityIssue, CompatibilitySolution } from '@/types/gear-calculator'

// Sample components with proper typing
const sampleComponents: Component[] = [
  {
    id: 'cassette-1',
    manufacturer: 'SRAM',
    model: 'PG-1230 Eagle',
    year: 2023,
    weightGrams: 350,
    msrp: 159.99,
    category: 'CASSETTE' as ComponentCategory,
    cassette: {
      speeds: 12,
      cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 50],
      freehubType: 'SRAM_XD'
    }
  },
  {
    id: 'cassette-2',
    manufacturer: 'Shimano',
    model: 'CS-M7100 SLX',
    year: 2022,
    weightGrams: 470,
    msrp: 89.99,
    category: 'CASSETTE' as ComponentCategory,
    cassette: {
      speeds: 12,
      cogs: [10, 12, 14, 16, 18, 21, 24, 28, 33, 39, 45, 51],
      freehubType: 'MICRO_SPLINE'
    }
  },
  {
    id: 'hub-1',
    manufacturer: 'DT Swiss',
    model: '350',
    year: 2023,
    weightGrams: 280,
    msrp: 189.99,
    category: 'HUB' as ComponentCategory,
    hub: {
      rearSpacing: 142,
      freehubTypes: ['SHIMANO_HG', 'SRAM_XD', 'MICRO_SPLINE'],
      axleType: 'THRU_AXLE_12_REAR'
    }
  },
  {
    id: 'hub-2',
    manufacturer: 'Hope',
    model: 'Pro 4',
    year: 2022,
    weightGrams: 320,
    msrp: 249.99,
    category: 'HUB' as ComponentCategory,
    hub: {
      rearSpacing: 142,
      freehubTypes: ['SHIMANO_HG'],
      axleType: 'THRU_AXLE_12_REAR'
    }
  },
  {
    id: 'derailleur-1',
    manufacturer: 'Shimano',
    model: 'XT M8100',
    year: 2021,
    weightGrams: 280,
    msrp: 89.99,
    category: 'DERAILLEUR' as ComponentCategory,
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
    category: 'DERAILLEUR' as ComponentCategory,
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
    const solutions: CompatibilitySolution[] = []

    // Check cassette/hub compatibility
    const cassette = selectedComponents.find(c => c.category === 'CASSETTE')
    const hub = selectedComponents.find(c => c.category === 'HUB')

    if (cassette && hub && cassette.cassette && hub.hub) {
      const cassetteFreehub = cassette.cassette.freehubType
      const hubFreehubs = hub.hub.freehubTypes

      if (!hubFreehubs.includes(cassetteFreehub)) {
        issues.push({
          type: 'freehub',
          severity: 'critical',
          message: `Cassette requires ${cassetteFreehub} freehub but hub only supports ${hubFreehubs.join(', ')}`,
          components: [cassette.model, hub.model],
          costToFix: 60,
          estimatedCost: 60
        })

        solutions.push({
          type: 'upgrade',
          description: `Convert hub to ${cassetteFreehub} freehub`,
          cost: 60,
          effort: 'medium',
          reliability: 95,
          message: `Install ${cassetteFreehub} freehub body on ${hub.model} hub`,
          difficulty: 'medium'
        })
      }
    }

    // Check derailleur capacity
    const derailleur = selectedComponents.find(c => c.category === 'DERAILLEUR')
    
    if (cassette && derailleur && cassette.cassette && derailleur.derailleur) {
      const largestCog = Math.max(...cassette.cassette.cogs)
      const derailleurMaxCog = derailleur.derailleur.maxCog || 50

      if (largestCog > derailleurMaxCog) {
        issues.push({
          type: 'capacity',
          severity: 'high',
          message: `Derailleur max cog (${derailleurMaxCog}T) insufficient for cassette (${largestCog}T)`,
          components: [cassette.model, derailleur.model],
          costToFix: 150,
          estimatedCost: 150
        })

        solutions.push({
          type: 'replace',
          description: 'Upgrade to higher capacity derailleur',
          cost: 150,
          effort: 'medium',
          reliability: 90,
          message: `Replace with derailleur that supports ${largestCog}T+ cassettes`,
          difficulty: 'medium'
        })
      }
    }

    const isCompatible = issues.length === 0 || !issues.some(i => i.severity === 'critical')
    const overallStatus = issues.length === 0 ? 'compatible' : 
                         issues.some(i => i.severity === 'critical') ? 'incompatible' : 'warning'

    setCompatibilityResults({
      status: overallStatus,
      issues,
      solutions,
      confidence: Math.max(0, 100 - (issues.length * 15)),
      isCompatible,
      overallStatus
    })
  }

  const getCompatibilityIcon = (status: string) => {
    switch (status) {
      case 'compatible':
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />
      case 'incompatible':
        return <XCircle className="w-6 h-6 text-red-600" />
      default:
        return <Info className="w-6 h-6 text-gray-600" />
    }
  }

  const getCompatibilityClass = (status: string) => {
    switch (status) {
      case 'compatible':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'incompatible':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
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
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{component.manufacturer}</h4>
                    <p className="text-sm text-gray-600">{component.model}</p>
                    <p className="text-xs text-gray-500 mt-1">{component.category}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Check Button */}
      <div className="mb-8">
        <button
          onClick={checkCompatibility}
          disabled={selectedComponents.length < 2}
          className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
            selectedComponents.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
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
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
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
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prevent Mistakes</h3>
            <p className="text-gray-600">Catch compatibility issues before you buy, not after you try to install.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
            <p className="text-gray-600">Get compatibility checks in seconds with our comprehensive database.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Money</h3>
            <p className="text-gray-600">Avoid buying incompatible parts and expensive returns.</p>
          </div>
        </div>
      </div>
    </div>
  )
}