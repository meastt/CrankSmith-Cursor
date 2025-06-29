'use client'

import { useState } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info, Search, Filter, RotateCcw } from 'lucide-react'

// Type definitions
interface Component {
  id: string
  manufacturer: string
  model: string
  year: number
  weightGrams: number
  msrp: number
  category: ComponentCategory
  cassette?: {
    speeds: number
    cogs: number[]
    freehubType: string
  }
  hub?: {
    spacing: number
    freehubTypes: string[]
  }
  derailleur?: {
    speeds: number
    maxCog: number
    capacity: number
    cageLength: string
    weightGrams: number // FIXED: Added missing weightGrams
  }
  chain?: {
    speeds: number
    material: string
  }
}

type ComponentCategory = 'CASSETTE' | 'HUB' | 'DERAILLEUR' | 'CRANKSET' | 'CHAIN'

interface CompatibilityIssue {
  message: string
  severity: 'warning' | 'critical'
  components: string[]
  estimatedCost: number
}

interface CompatibilitySolution {
  message: string
  cost: number
  difficulty: 'easy' | 'medium' | 'hard'
}

interface CompatibilityStatus {
  status: string
  issues: CompatibilityIssue[]
  solutions: CompatibilitySolution[]
  confidence: number
  isCompatible: boolean
  overallStatus: string
}

// FIXED: Complete sample components with all required data
const sampleComponents: Component[] = [
  {
    id: 'cassette-1',
    manufacturer: 'SRAM',
    model: 'PG-1230 Eagle',
    year: 2022,
    weightGrams: 344,
    msrp: 89.00,
    category: 'CASSETTE',
    cassette: {
      speeds: 12,
      cogs: [11,13,15,17,19,22,25,28,32,36,42,50],
      freehubType: 'HG'
    }
  },
  {
    id: 'cassette-2',
    manufacturer: 'Shimano',
    model: 'XT M8100',
    year: 2023,
    weightGrams: 420,
    msrp: 95.00,
    category: 'CASSETTE',
    cassette: {
      speeds: 12,
      cogs: [10,12,14,16,18,21,24,28,32,36,40,45],
      freehubType: 'HG'
    }
  },
  {
    id: 'cassette-3',
    manufacturer: 'SRAM',
    model: 'XG-1295 Eagle',
    year: 2023,
    weightGrams: 355,
    msrp: 450.00,
    category: 'CASSETTE',
    cassette: {
      speeds: 12,
      cogs: [10,12,14,16,18,21,24,28,32,36,42,52],
      freehubType: 'XD'
    }
  },
  {
    id: 'hub-1',
    manufacturer: 'DT Swiss',
    model: '350',
    year: 2023,
    weightGrams: 295,
    msrp: 125.00,
    category: 'HUB',
    hub: {
      spacing: 142,
      freehubTypes: ['HG', 'XD', 'Microspline']
    }
  },
  {
    id: 'hub-2',
    manufacturer: 'Hope',
    model: 'Pro 4',
    year: 2022,
    weightGrams: 280,
    msrp: 160.00,
    category: 'HUB',
    hub: {
      spacing: 142,
      freehubTypes: ['HG'] // Only HG - will cause issues with XD cassettes
    }
  },
  {
    id: 'hub-3',
    manufacturer: 'Industry Nine',
    model: 'Hydra',
    year: 2023,
    weightGrams: 320,
    msrp: 400.00,
    category: 'HUB',
    hub: {
      spacing: 148, // Boost spacing
      freehubTypes: ['HG', 'XD', 'Microspline']
    }
  },
  {
    id: 'derailleur-1',
    manufacturer: 'Shimano',
    model: 'XT M8100',
    year: 2021,
    weightGrams: 265,
    msrp: 105.00,
    category: 'DERAILLEUR',
    derailleur: {
      speeds: 12,
      maxCog: 45,
      capacity: 35,
      cageLength: 'LONG',
      weightGrams: 265
    }
  },
  {
    id: 'derailleur-2',
    manufacturer: 'SRAM',
    model: 'GX Eagle',
    year: 2022,
    weightGrams: 280,
    msrp: 120.00,
    category: 'DERAILLEUR',
    derailleur: {
      speeds: 12,
      maxCog: 52,
      capacity: 42,
      cageLength: 'LONG',
      weightGrams: 280
    }
  },
  {
    id: 'derailleur-3',
    manufacturer: 'Shimano',
    model: 'SLX M7100',
    year: 2022,
    weightGrams: 290,
    msrp: 85.00,
    category: 'DERAILLEUR',
    derailleur: {
      speeds: 12,
      maxCog: 42,
      capacity: 32,
      cageLength: 'MEDIUM',
      weightGrams: 290
    }
  },
  {
    id: 'chain-1',
    manufacturer: 'SRAM',
    model: 'GX Eagle',
    year: 2022,
    weightGrams: 265,
    msrp: 35.00,
    category: 'CHAIN',
    chain: {
      speeds: 12,
      material: 'Steel'
    }
  },
  {
    id: 'chain-2',
    manufacturer: 'Shimano',
    model: 'XT M8100',
    year: 2022,
    weightGrams: 245,
    msrp: 45.00,
    category: 'CHAIN',
    chain: {
      speeds: 12,
      material: 'Steel'
    }
  }
]

export default function CompatibilityPage() {
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([])
  const [compatibilityResults, setCompatibilityResults] = useState<CompatibilityStatus | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'ALL'>('ALL')
  const [isLoading, setIsLoading] = useState(false)

  // FIXED: Complete filtering logic
  const filteredComponents = sampleComponents.filter(component => {
    const matchesSearch = component.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || component.category === selectedCategory
    const notAlreadySelected = !selectedComponents.some(selected => selected.id === component.id)
    
    return matchesSearch && matchesCategory && notAlreadySelected
  })

  const handleComponentSelect = (component: Component) => {
    // Check if we already have a component of this category
    const existingIndex = selectedComponents.findIndex(c => c.category === component.category)
    
    let newSelectedComponents
    if (existingIndex >= 0) {
      // Replace existing component of same category
      newSelectedComponents = [...selectedComponents]
      newSelectedComponents[existingIndex] = component
    } else {
      // Add new component
      newSelectedComponents = [...selectedComponents, component]
    }
    
    setSelectedComponents(newSelectedComponents)
    
    // Auto-check compatibility if we have at least 2 components
    if (newSelectedComponents.length >= 2) {
      setTimeout(() => checkCompatibility(newSelectedComponents), 500)
    }
  }

  const handleComponentRemove = (componentId: string) => {
    const newSelectedComponents = selectedComponents.filter(c => c.id !== componentId)
    setSelectedComponents(newSelectedComponents)
    
    if (newSelectedComponents.length < 2) {
      setCompatibilityResults(null)
    } else {
      setTimeout(() => checkCompatibility(newSelectedComponents), 500)
    }
  }

  const clearAllComponents = () => {
    setSelectedComponents([])
    setCompatibilityResults(null)
  }

  const checkCompatibility = (components: Component[] = selectedComponents) => {
    if (components.length < 2) {
      alert('Please select at least 2 components to check compatibility')
      return
    }

    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const issues: CompatibilityIssue[] = []
      const solutions: CompatibilitySolution[] = []

      // Find cassette and hub components
      const cassette = components.find(c => c.category === 'CASSETTE')
      const hub = components.find(c => c.category === 'HUB')
      const derailleur = components.find(c => c.category === 'DERAILLEUR')
      const chain = components.find(c => c.category === 'CHAIN')

      // Check cassette/hub compatibility
      if (cassette?.cassette && hub?.hub) {
        const cassetteFreehub = cassette.cassette.freehubType
        const hubFreehubs = hub.hub.freehubTypes

        if (!hubFreehubs.includes(cassetteFreehub)) {
          issues.push({
            message: `${cassette.manufacturer} ${cassette.model} requires ${cassetteFreehub} freehub, but ${hub.manufacturer} ${hub.model} only supports ${hubFreehubs.join(', ')}`,
            severity: 'critical',
            components: [cassette.manufacturer + ' ' + cassette.model, hub.manufacturer + ' ' + hub.model],
            estimatedCost: 150
          })

          solutions.push({
            message: 'Replace freehub body with compatible type or choose different cassette',
            cost: 150,
            difficulty: 'medium'
          })
        }
      }

      // Check derailleur capacity
      if (cassette?.cassette && derailleur?.derailleur) {
        const largestCog = Math.max(...cassette.cassette.cogs)
        const maxCog = derailleur.derailleur.maxCog

        if (largestCog > maxCog) {
          issues.push({
            message: `${derailleur.manufacturer} ${derailleur.model} max capacity is ${maxCog}T, but ${cassette.manufacturer} ${cassette.model} has ${largestCog}T cog`,
            severity: 'critical',
            components: [derailleur.manufacturer + ' ' + derailleur.model, cassette.manufacturer + ' ' + cassette.model],
            estimatedCost: 200
          })

          solutions.push({
            message: 'Upgrade to derailleur with higher capacity or choose cassette with smaller largest cog',
            cost: 200,
            difficulty: 'medium'
          })
        }
      }

      // Check chain/cassette speed compatibility
      if (cassette?.cassette && chain?.chain) {
        if (cassette.cassette.speeds !== chain.chain.speeds) {
          issues.push({
            message: `${chain.manufacturer} ${chain.model} is ${chain.chain.speeds}-speed but ${cassette.manufacturer} ${cassette.model} is ${cassette.cassette.speeds}-speed`,
            severity: 'critical',
            components: [chain.manufacturer + ' ' + chain.model, cassette.manufacturer + ' ' + cassette.model],
            estimatedCost: 50
          })

          solutions.push({
            message: 'Replace chain with correct speed rating to match cassette',
            cost: 50,
            difficulty: 'easy'
          })
        }
      }

      // Check hub spacing compatibility
      if (hub?.hub && hub.hub.spacing === 148) {
        const hasBoostComponents = components.some(c => 
          c.manufacturer.toLowerCase().includes('boost') || 
          c.model.toLowerCase().includes('boost')
        )
        
        if (!hasBoostComponents && components.length > 2) {
          issues.push({
            message: `${hub.manufacturer} ${hub.model} uses 148mm Boost spacing - ensure frame and other components are Boost compatible`,
            severity: 'warning',
            components: [hub.manufacturer + ' ' + hub.model],
            estimatedCost: 0
          })

          solutions.push({
            message: 'Verify frame has 148mm Boost rear spacing or use 142mm hub',
            cost: 0,
            difficulty: 'easy'
          })
        }
      }

      const isCompatible = issues.filter(i => i.severity === 'critical').length === 0
      const hasCriticalIssues = issues.some(issue => issue.severity === 'critical')
      const overallStatus = isCompatible ? 'compatible' : 
                           hasCriticalIssues ? 'incompatible' : 'warning'

      setCompatibilityResults({
        status: overallStatus,
        issues,
        solutions,
        confidence: Math.max(0, 100 - (issues.length * 15)),
        isCompatible,
        overallStatus
      })
      
      setIsLoading(false)
    }, 1000)
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

  const getCategoryIcon = (category: ComponentCategory) => {
    const iconClass = "w-4 h-4"
    switch (category) {
      case 'CASSETTE': return '⚙️'
      case 'HUB': return '🔧'
      case 'DERAILLEUR': return '🔗'
      case 'CHAIN': return '⛓️'
      case 'CRANKSET': return '🚴'
      default: return '🔧'
    }
  }

  const categories: (ComponentCategory | 'ALL')[] = ['ALL', 'CASSETTE', 'HUB', 'DERAILLEUR', 'CHAIN', 'CRANKSET']

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Component Compatibility Checker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select components to check compatibility and get instant feedback on potential issues.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Component Selection Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Select Components</h2>
                {selectedComponents.length > 0 && (
                  <button
                    onClick={clearAllComponents}
                    className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear All
                  </button>
                )}
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category === 'ALL' ? 'All' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Components */}
              {selectedComponents.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Selected Components ({selectedComponents.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedComponents.map((component) => (
                      <div
                        key={component.id}
                        className="inline-flex items-center px-3 py-2 bg-primary-100 text-primary-800 rounded-lg text-sm"
                      >
                        <span className="mr-2">{getCategoryIcon(component.category)}</span>
                        <span className="font-medium">{component.manufacturer}</span>
                        <span className="mx-1">•</span>
                        <span>{component.model}</span>
                        <button
                          onClick={() => handleComponentRemove(component.id)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Components */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredComponents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm || selectedCategory !== 'ALL' ? 'No components found matching your criteria' : 'All components selected'}
                  </div>
                ) : (
                  filteredComponents.map((component) => (
                    <div
                      key={component.id}
                      onClick={() => handleComponentSelect(component)}
                      className="p-4 border border-gray-200 rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-primary-300 hover:bg-primary-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="mr-2">{getCategoryIcon(component.category)}</span>
                            <span className="text-xs font-medium text-gray-500 uppercase">{component.category}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900">{component.manufacturer}</h4>
                          <p className="text-sm text-gray-600">{component.model} ({component.year})</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{component.weightGrams}g</span>
                            <span>${component.msrp}</span>
                            {component.cassette && (
                              <span>{component.cassette.speeds}-speed • {component.cassette.freehubType}</span>
                            )}
                            {component.hub && (
                              <span>{component.hub.spacing}mm • {component.hub.freehubTypes.join(', ')}</span>
                            )}
                            {component.derailleur && (
                              <span>Max {component.derailleur.maxCog}T • {component.derailleur.cageLength}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-primary-600 font-medium text-sm">
                          Select
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Compatibility Results</h2>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-600">Checking compatibility...</p>
                </div>
              ) : selectedComponents.length < 2 ? (
                <div className="text-center py-8 text-gray-500">
                  <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>Select at least 2 components to check compatibility</p>
                </div>
              ) : compatibilityResults ? (
                <div className={`border rounded-lg p-4 ${getCompatibilityClass(compatibilityResults.overallStatus)}`}>
                  <div className="flex items-center mb-4">
                    {getCompatibilityIcon(compatibilityResults.overallStatus)}
                    <h3 className="text-lg font-bold text-gray-900 ml-3">
                      {compatibilityResults.isCompatible ? 'Compatible!' : 'Issues Found'}
                    </h3>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Confidence Level</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          compatibilityResults.confidence >= 80 ? 'bg-green-600' :
                          compatibilityResults.confidence >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${compatibilityResults.confidence}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{compatibilityResults.confidence}% confident</div>
                  </div>

                  {compatibilityResults.issues.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Issues:</h4>
                      {compatibilityResults.issues.map((issue, index) => (
                        <div key={index} className="p-3 bg-white rounded border">
                          <div className="flex items-start">
                            {issue.severity === 'critical' ? (
                              <XCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 font-medium">{issue.message}</p>
                              {issue.estimatedCost > 0 && (
                                <p className="text-xs text-gray-600 mt-1">
                                  Estimated fix cost: ${issue.estimatedCost}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {compatibilityResults.solutions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium text-gray-900">Solutions:</h4>
                      {compatibilityResults.solutions.map((solution, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded border border-blue-200">
                          <p className="text-sm text-blue-900">{solution.message}</p>
                          <div className="flex items-center justify-between mt-2 text-xs">
                            <span className="text-blue-700">Difficulty: {solution.difficulty}</span>
                            {solution.cost > 0 && (
                              <span className="text-blue-700">Cost: ${solution.cost}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}