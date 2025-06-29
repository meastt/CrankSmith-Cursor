'use client'

import { useState } from 'react'
import { GearCalculator } from '@/lib/gear-calculator'
import { ChainlineResult } from '@/types/gear-calculator'
import { Target, Ruler, Settings, TrendingUp, AlertTriangle, CheckCircle, Info, Gauge } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

interface ChainlineParams {
  chainringOffset: number
  cassetteOffset: number
  chainstayLength: number
  bottomBracketWidth: number
  frameType: 'road' | 'mtb' | 'gravel'
}

export default function ChainlinePage() {
  const [params, setParams] = useState<ChainlineParams>({
    chainringOffset: 6,
    cassetteOffset: 0,
    chainstayLength: 430,
    bottomBracketWidth: 73,
    frameType: 'mtb'
  })

  const [results, setResults] = useState<ChainlineResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleParamChange = (field: keyof ChainlineParams, value: any) => {
    setParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateChainline = () => {
    setIsCalculating(true)
    
    try {
      const chainlineResults = GearCalculator.analyzeChainline(
        params.chainringOffset,
        params.cassetteOffset,
        params.chainstayLength
      )
      setResults(chainlineResults)
    } catch (error) {
      console.error('Calculation error:', error)
      alert('Error analyzing chainline. Please check your inputs.')
    } finally {
      setIsCalculating(false)
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-success-600'
    if (efficiency >= 85) return 'text-warning-600'
    return 'text-error-600'
  }

  const getEfficiencyStatus = (efficiency: number) => {
    if (efficiency >= 95) return { status: 'excellent', message: 'Excellent' }
    if (efficiency >= 85) return { status: 'good', message: 'Good' }
    if (efficiency >= 75) return { status: 'fair', message: 'Fair' }
    return { status: 'poor', message: 'Poor' }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chainline Analyzer
          </h1>
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Calculators', href: '/calculators' },
              { label: 'Chainline Analysis', href: '/calculators/chainline' }
            ]} 
          />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Optimize your drivetrain alignment for maximum efficiency and reduced wear. Perfect chainline means better performance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Setup</h2>
            
            <div className="space-y-6">
              {/* Chainring Offset */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-2" />
                  Chainring Offset (mm)
                </label>
                <input
                  type="number"
                  value={params.chainringOffset}
                  onChange={(e) => handleParamChange('chainringOffset', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="-10"
                  max="20"
                  step="0.5"
                />
                <p className="text-xs text-gray-500 mt-1">Distance from centerline to chainring center</p>
              </div>

              {/* Cassette Offset */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-2" />
                  Cassette Offset (mm)
                </label>
                <input
                  type="number"
                  value={params.cassetteOffset}
                  onChange={(e) => handleParamChange('cassetteOffset', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="-5"
                  max="5"
                  step="0.5"
                />
                <p className="text-xs text-gray-500 mt-1">Distance from centerline to cassette center</p>
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

              {/* Bottom Bracket Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Bottom Bracket Width (mm)
                </label>
                <select
                  value={params.bottomBracketWidth}
                  onChange={(e) => handleParamChange('bottomBracketWidth', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={68}>68mm (Road)</option>
                  <option value={73}>73mm (MTB)</option>
                  <option value={83}>83mm (DH/Enduro)</option>
                  <option value={100}>100mm (Fat Bike)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Affects optimal chainring positioning</p>
              </div>

              {/* Frame Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Frame Type
                </label>
                <select
                  value={params.frameType}
                  onChange={(e) => handleParamChange('frameType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="road">Road</option>
                  <option value="mtb">Mountain Bike</option>
                  <option value="gravel">Gravel</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Affects optimal chainline targets</p>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateChainline}
                disabled={isCalculating}
                className="w-full btn-primary"
              >
                {isCalculating ? 'Analyzing...' : 'Analyze Chainline'}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Chainline Analysis</h2>
            
            {results ? (
              <div className="space-y-6">
                {/* Efficiency Display */}
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Drivetrain Efficiency</h3>
                  <p className={`text-4xl font-bold ${getEfficiencyColor(results.efficiency)}`}>
                    {results.efficiency.toFixed(1)}%
                  </p>
                  {(() => {
                    const status = getEfficiencyStatus(results.efficiency)
                    return (
                      <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEfficiencyColor(results.efficiency)} bg-gray-100`}>
                        {status.message}
                      </div>
                    )
                  })()}
                </div>

                {/* Chainline Measurements */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Optimal Chainline</h3>
                    <p className="text-2xl font-bold text-primary-600">
                      {results.optimalChainline.toFixed(1)}mm
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Current Chainline</h3>
                    <p className="text-2xl font-bold text-gray-600">
                      {results.currentChainline.toFixed(1)}mm
                    </p>
                  </div>
                </div>

                {/* Deviation */}
                <div className="p-4 bg-warning-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Deviation from Optimal</h3>
                  <p className={`text-lg font-bold ${Math.abs(results.deviation) > 2 ? 'text-warning-600' : 'text-success-600'}`}>
                    {results.deviation > 0 ? '+' : ''}{results.deviation.toFixed(1)}mm
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.abs(results.deviation) <= 2 ? 'Within acceptable range' : 'Consider adjustment'}
                  </p>
                </div>

                {/* Recommendations */}
                {results.recommendations.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
                    <div className="space-y-2">
                      {results.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Enter your measurements to analyze chainline</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Chainline Optimization Tips</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Measure Accurately</h3>
              <p className="text-gray-600">Use a chainline gauge or caliper for precise measurements. Small errors can affect efficiency significantly.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimize for Common Gears</h3>
              <p className="text-gray-600">Set chainline for the gears you use most often, typically the middle of your cassette range.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consider Frame Design</h3>
              <p className="text-gray-600">Different frame types have different optimal chainlines. Road bikes typically need narrower chainlines than MTBs.</p>
            </div>
          </div>
        </div>

        {/* Common Chainline Values */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Optimal Chainlines</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded text-center">
              <p className="font-medium text-gray-900">Road Bikes</p>
              <p className="text-sm text-gray-600">43.5-45.5mm</p>
            </div>
            <div className="p-3 bg-gray-50 rounded text-center">
              <p className="font-medium text-gray-900">Gravel Bikes</p>
              <p className="text-sm text-gray-600">44.5-46.5mm</p>
            </div>
            <div className="p-3 bg-gray-50 rounded text-center">
              <p className="font-medium text-gray-900">Trail Bikes</p>
              <p className="text-sm text-gray-600">47.5-49.5mm</p>
            </div>
            <div className="p-3 bg-gray-50 rounded text-center">
              <p className="font-medium text-gray-900">Boost Bikes</p>
              <p className="text-sm text-gray-600">49.5-51.5mm</p>
            </div>
          </div>
        </div>

        {/* Measurement Guide */}
        <div className="mt-12 p-6 bg-primary-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Measure Chainline</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Chainring Chainline</h4>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Measure from frame centerline to chainring center</li>
                <li>2. Use a straight edge across the chainring</li>
                <li>3. Measure to the center of the chainring teeth</li>
                <li>4. Account for any offset in your crankset</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Cassette Chainline</h4>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Measure from frame centerline to cassette center</li>
                <li>2. Use the middle cog as reference</li>
                <li>3. Account for hub flange offset</li>
                <li>4. Consider cassette spacing differences</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 