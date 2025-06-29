'use client'

import { useState } from 'react'
import { TirePressureCalculator, TirePressureParams, TirePressureResult } from '@/lib/tire-pressure-calculator'
import { Gauge, Weight, Bike, Settings, TrendingUp, AlertTriangle, CheckCircle, Info, Droplets, Mountain } from 'lucide-react'
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

export default function TirePressurePage() {
  const [params, setParams] = useState<TirePressureParams>({
    riderWeight: 160,
    bikeWeight: 30,
    tireWidth: 40,
    wheelDiameter: 29,
    terrain: 'trail',
    tubeless: true,
    conditions: 'dry',
    priority: 'balanced'
  })

  const [results, setResults] = useState<TirePressureResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleParamChange = (field: keyof TirePressureParams, value: any) => {
    setParams(prev => {
      const newParams = { ...prev, [field]: value }
      
      // Auto-adjust tire width based on terrain
      if (field === 'terrain') {
        const recommendations = TirePressureCalculator.getTireWidthRecommendations(value)
        newParams.tireWidth = recommendations.default
      }
      
      return newParams
    })
  }

  const calculatePressure = () => {
    setIsCalculating(true)
    
    try {
      const pressureResults = TirePressureCalculator.calculateOptimalPressure(params)
      setResults(pressureResults)
      toast.success('Tire pressure calculated successfully!')
    } catch (error) {
      console.error('Calculation error:', error)
      toast.error('Error calculating tire pressure. Please check your inputs.')
    } finally {
      setIsCalculating(false)
    }
  }

  const getTerrainIcon = (terrain: string) => {
    const icons = {
      road: '🛣️',
      gravel: '🪨', 
      xc_trail: '🌲',
      trail: '⛰️',
      enduro: '🏔️',
      downhill: '⬇️'
    }
    return icons[terrain as keyof typeof icons] || '🚴'
  }

  const getPressureColor = (psi: number, terrain: string) => {
    const ranges = {
      road: { low: 80, high: 120 },
      gravel: { low: 35, high: 65 },
      xc_trail: { low: 25, high: 40 },
      trail: { low: 20, high: 35 },
      enduro: { low: 18, high: 30 },
      downhill: { low: 15, high: 25 }
    }
    
    const range = ranges[terrain as keyof typeof ranges] || ranges.trail
    
    if (psi < range.low * 0.8) return 'text-red-600'
    if (psi < range.low) return 'text-yellow-600'
    if (psi > range.high) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const tireWidthRecommendations = TirePressureCalculator.getTireWidthRecommendations(params.terrain)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title="Advanced Tire Pressure Calculator"
          description="Get scientifically accurate tire pressure recommendations based on your weight, bike setup, terrain, and riding style. Optimized for road, gravel, and mountain bike disciplines."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Calculators', href: '/calculators' },
            { label: 'Tire Pressure', href: '/calculators/tire-pressure' }
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            {/* Rider Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Weight className="w-5 h-5 mr-2" />
                Rider & Bike Details
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rider Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={params.riderWeight}
                    onChange={(e) => handleParamChange('riderWeight', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="80"
                    max="300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bike Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={params.bikeWeight}
                    onChange={(e) => handleParamChange('bikeWeight', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="15"
                    max="50"
                  />
                </div>
              </div>
            </div>

            {/* Bike Setup */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Bike Setup
              </h2>
              
              <div className="space-y-4">
                {/* Terrain */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terrain Type
                  </label>
                  <select
                    value={params.terrain}
                    onChange={(e) => handleParamChange('terrain', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="road">🛣️ Road</option>
                    <option value="gravel">🪨 Gravel</option>
                    <option value="xc_trail">🌲 XC Trail</option>
                    <option value="trail">⛰️ Trail</option>
                    <option value="enduro">🏔️ Enduro</option>
                    <option value="downhill">⬇️ Downhill</option>
                  </select>
                </div>

                {/* Tire Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tire Width (mm)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={params.tireWidth}
                      onChange={(e) => handleParamChange('tireWidth', parseInt(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="20"
                      max="100"
                    />
                    <select
                      value={params.tireWidth}
                      onChange={(e) => handleParamChange('tireWidth', parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {tireWidthRecommendations.widths.map(width => (
                        <option key={width} value={width}>{width}mm</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {tireWidthRecommendations.notes.map((note, index) => (
                      <div key={index}>{note}</div>
                    ))}
                  </div>
                </div>

                {/* Wheel Diameter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wheel Diameter
                  </label>
                  <select
                    value={params.wheelDiameter}
                    onChange={(e) => handleParamChange('wheelDiameter', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={26}>26" (26 inches)</option>
                    <option value={27.5}>650B (27.5 inches)</option>
                    <option value={28}>700C (28 inches)</option>
                    <option value={29}>29" (29 inches)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Riding Conditions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Mountain className="w-5 h-5 mr-2" />
                Riding Conditions
              </h2>
              
              <div className="space-y-4">
                {/* Conditions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trail Conditions
                  </label>
                  <select
                    value={params.conditions}
                    onChange={(e) => handleParamChange('conditions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dry">☀️ Dry</option>
                    <option value="wet">🌧️ Wet</option>
                    <option value="mixed">⛅ Mixed</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={params.priority}
                    onChange={(e) => handleParamChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="comfort">🛋️ Comfort</option>
                    <option value="balanced">⚖️ Balanced</option>
                    <option value="speed">🏃 Speed</option>
                    <option value="grip">🤝 Maximum Grip</option>
                  </select>
                </div>

                {/* Tubeless */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={params.tubeless}
                      onChange={(e) => handleParamChange('tubeless', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Tubeless Setup</span>
                  </label>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculatePressure}
                  disabled={isCalculating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Optimal Pressure'}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Pressure Results */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Recommended Pressure</h2>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Confidence:</span>
                      <span className={`font-semibold ${getConfidenceColor(results.confidence)}`}>
                        {results.confidence}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Front Tire</h3>
                      <p className={`text-3xl font-bold ${getPressureColor(results.frontPSI, params.terrain)}`}>
                        {results.frontPSI} PSI
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Rear Tire</h3>
                      <p className={`text-3xl font-bold ${getPressureColor(results.rearPSI, params.terrain)}`}>
                        {results.rearPSI} PSI
                      </p>
                    </div>
                  </div>

                  {/* Pressure Range */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Safe Operating Range</h3>
                    <p className="text-sm text-gray-600">
                      {results.range.min} - {results.range.max} PSI
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Adjust within this range based on personal preference and conditions
                    </p>
                  </div>
                </div>

                {/* Warnings */}
                {results.warnings.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Important Warnings
                    </h3>
                    <div className="space-y-1">
                      {results.warnings.map((warning, index) => (
                        <p key={index} className="text-sm text-yellow-700">{warning}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Terrain Notes */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    {getTerrainIcon(params.terrain)}
                    <span className="ml-2">Terrain-Specific Notes</span>
                  </h3>
                  <div className="space-y-2">
                    {results.terrainNotes.map((note, index) => (
                      <div key={index} className="flex items-start">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-600">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Setup Notes */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Setup Information
                  </h3>
                  <div className="space-y-2">
                    {results.setupNotes.map((note, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-600">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Pro Tips & Recommendations
                  </h3>
                  <div className="space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">💡</span>
                        <p className="text-sm text-green-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Getting Started Guide */}
            {!results && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-600">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Enter Your Details</h3>
                      <p className="text-sm text-gray-600">Input your weight, bike weight, and tire specifications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-600">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Select Terrain & Conditions</h3>
                      <p className="text-sm text-gray-600">Choose your riding style and trail conditions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-600">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Get Precise Recommendations</h3>
                      <p className="text-sm text-gray-600">Receive scientifically calculated pressure recommendations</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Why Accurate Pressure Matters</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Too High:</strong> Reduced traction, harsh ride, increased puncture risk</li>
                    <li>• <strong>Too Low:</strong> Pinch flats, poor rolling efficiency, rim damage</li>
                    <li>• <strong>Just Right:</strong> Optimal grip, comfort, speed, and tire life</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Reference Chart */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Reference Pressure Ranges</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { terrain: 'Road', icon: '🛣️', range: '80-120 PSI', tires: '23-32mm' },
              { terrain: 'Gravel', icon: '🪨', range: '35-65 PSI', tires: '32-45mm' },
              { terrain: 'XC Trail', icon: '🌲', range: '25-40 PSI', tires: '35-45mm' },
              { terrain: 'Trail', icon: '⛰️', range: '20-35 PSI', tires: '45-60mm' },
              { terrain: 'Enduro', icon: '🏔️', range: '18-30 PSI', tires: '55-70mm' },
              { terrain: 'Downhill', icon: '⬇️', range: '15-25 PSI', tires: '60-80mm' }
            ].map((item, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm">{item.terrain}</h3>
                <p className="text-sm text-blue-600 font-medium">{item.range}</p>
                <p className="text-xs text-gray-500">{item.tires}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            * Ranges are approximate. Use calculator above for precise recommendations based on your setup.
          </p>
        </div>
      </div>
    </div>
  )
}