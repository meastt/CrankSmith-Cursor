'use client'

import { useState } from 'react'
import { GearCalculator } from '@/lib/gear-calculator'
import { ChainLengthResult } from '@/types/gear-calculator'
import { Link, Ruler, Settings, Info, CheckCircle, AlertTriangle, Calculator } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { LoadingSpinner } from '@/components/ui/loading'
import { toast } from '@/components/ui/toast'

// Page Header Component
const PageHeader = ({ title, description, breadcrumbs }: { title: string; description: string; breadcrumbs: Array<{ label: string; href: string }> }) => (
  <div className="mb-8">
    <Breadcrumbs items={breadcrumbs} />
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-gray-600">{description}</p>
  </div>
)

interface ChainLengthParams {
  chainringTeeth: number
  cassetteLargestCog: number
  chainstayLength: number
  derailleurCapacity?: number
  derailleurType: 'short' | 'medium' | 'long'
}

export default function ChainLengthPage() {
  const [params, setParams] = useState<ChainLengthParams>({
    chainringTeeth: 32,
    cassetteLargestCog: 45,
    chainstayLength: 430,
    derailleurCapacity: 35,
    derailleurType: 'medium'
  })

  const [results, setResults] = useState<ChainLengthResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleParamChange = (field: keyof ChainLengthParams, value: any) => {
    setParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateChainLength = () => {
    setIsCalculating(true)
    
    try {
      const chainResults = GearCalculator.calculateChainLength(
        params.chainringTeeth,
        params.cassetteLargestCog,
        params.chainstayLength
      )
      setResults(chainResults)
      toast.success('Chain length calculated successfully!')
    } catch (error) {
      console.error('Calculation error:', error)
      toast.error('Error calculating chain length. Please check your inputs.')
    } finally {
      setIsCalculating(false)
    }
  }

  const getChainLengthStatus = (links: number) => {
    if (links < 110) return { status: 'short', color: 'text-error-600', message: 'Too Short' }
    if (links > 130) return { status: 'long', color: 'text-warning-600', message: 'Very Long' }
    return { status: 'normal', color: 'text-success-600', message: 'Optimal' }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title="Chain Length Calculator"
          description="Calculate the perfect chain length for your drivetrain. Get the right length for optimal shifting and derailleur performance."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Calculators', href: '/calculators' },
            { label: 'Chain Length', href: '/calculators/chain-length' }
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Drivetrain</h2>
            
            <div className="space-y-6">
              {/* Chainring Teeth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Chainring Teeth
                </label>
                <input
                  type="number"
                  value={params.chainringTeeth}
                  onChange={(e) => handleParamChange('chainringTeeth', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="20"
                  max="60"
                />
                <p className="text-xs text-gray-500 mt-1">Number of teeth on your largest chainring</p>
              </div>

              {/* Cassette Largest Cog */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Link className="w-4 h-4 inline mr-2" />
                  Cassette Largest Cog (T)
                </label>
                <input
                  type="number"
                  value={params.cassetteLargestCog}
                  onChange={(e) => handleParamChange('cassetteLargestCog', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="28"
                  max="52"
                />
                <p className="text-xs text-gray-500 mt-1">Number of teeth on your largest cassette cog</p>
              </div>

              {/* Chainstay Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="w-4 h-4 inline mr-2" />
                  Chainstay Length (mm)
                </label>
                <input
                  type="number"
                  value={params.chainstayLength}
                  onChange={(e) => handleParamChange('chainstayLength', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="400"
                  max="500"
                />
                <p className="text-xs text-gray-500 mt-1">Distance from bottom bracket to rear axle</p>
              </div>

              {/* Derailleur Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Derailleur Cage Length
                </label>
                <select
                  value={params.derailleurType}
                  onChange={(e) => handleParamChange('derailleurType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="short">Short Cage</option>
                  <option value="medium">Medium Cage</option>
                  <option value="long">Long Cage</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Affects chain capacity and length requirements</p>
              </div>

              {/* Derailleur Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calculator className="w-4 h-4 inline mr-2" />
                  Derailleur Capacity (T)
                </label>
                <input
                  type="number"
                  value={params.derailleurCapacity}
                  onChange={(e) => handleParamChange('derailleurCapacity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="20"
                  max="50"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum tooth difference the derailleur can handle</p>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateChainLength}
                disabled={isCalculating}
                className="w-full btn-primary"
              >
                {isCalculating ? 'Calculating...' : 'Calculate Chain Length'}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Chain Length Results</h2>
            
            {results ? (
              <div className="space-y-6">
                {/* Chain Length Display */}
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Recommended Chain Length</h3>
                  <div className="flex items-center justify-center space-x-4">
                    <div>
                      <p className="text-4xl font-bold text-primary-600">{results.links}</p>
                      <p className="text-sm text-gray-600">Links</p>
                    </div>
                    <div className="text-gray-400">|</div>
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{results.length}</p>
                      <p className="text-sm text-gray-600">mm</p>
                    </div>
                  </div>
                  
                  {(() => {
                    const status = getChainLengthStatus(results.links)
                    return (
                      <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color} bg-gray-100`}>
                        {status.message}
                      </div>
                    )
                  })()}
                </div>

                {/* Tolerance Range */}
                <div className="p-4 bg-primary-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Acceptable Range</h3>
                  <p className="text-sm text-gray-600">
                    {results.tolerance.min} - {results.tolerance.max} links
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ({results.tolerance.min * 12.7} - {results.tolerance.max * 12.7} mm)
                  </p>
                </div>

                {/* Notes */}
                {results.notes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Important Notes</h3>
                    <div className="space-y-2">
                      {results.notes.map((note, index) => (
                        <div key={index} className="flex items-start">
                          <Info className="w-4 h-4 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Link className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Enter your drivetrain details to calculate chain length</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Chain Length Tips</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Measure Twice</h3>
              <p className="text-gray-600">Always measure your chainstay length accurately. Small errors can lead to incorrect chain length.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Test the Setup</h3>
              <p className="text-gray-600">Install the chain and test shifting through all gears before cutting to final length.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Info className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consider Wear</h3>
              <p className="text-gray-600">New chains may stretch slightly. Consider adding 1-2 links for new chains on older drivetrains.</p>
            </div>
          </div>
        </div>

        {/* Common Chainstay Lengths */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Chainstay Lengths</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded text-center">
              <p className="font-medium text-gray-900">Road Bikes</p>
              <p className="text-sm text-gray-600">405-415mm</p>
            </div>
            <div className="p-3 bg-gray-50 rounded text-center">
              <p className="font-medium text-gray-900">Gravel Bikes</p>
              <p className="text-sm text-gray-600">415-425mm</p>
            </div>
            <div className="p-3 bg-gray-50 rounded text-center">
              <p className="font-medium text-gray-900">Trail Bikes</p>
              <p className="text-sm text-gray-600">430-445mm</p>
            </div>
            <div className="p-3 bg-gray-50 rounded text-center">
              <p className="font-medium text-gray-900">Enduro/DH</p>
              <p className="text-sm text-gray-600">445-470mm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 