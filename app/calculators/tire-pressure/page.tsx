'use client'

import { useState } from 'react'
import { GearCalculator } from '@/lib/gear-calculator'
import { CalculatorParams, TirePressureResult } from '@/types/gear-calculator'
import { Gauge, Weight, Bike, Settings, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react'

export default function TirePressurePage() {
  const [params, setParams] = useState<CalculatorParams>({
    riderWeight: 160,
    bikeWeight: 30,
    cadence: 90,
    wheelDiameter: 29,
    tireWidth: 2.4,
    terrain: 'trail',
    tubeless: true
  })

  const [results, setResults] = useState<TirePressureResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleParamChange = (field: keyof CalculatorParams, value: any) => {
    setParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculatePressure = () => {
    setIsCalculating(true)
    
    try {
      const pressureResults = GearCalculator.calculateTirePressure(params)
      setResults(pressureResults)
    } catch (error) {
      console.error('Calculation error:', error)
      alert('Error calculating tire pressure. Please check your inputs.')
    } finally {
      setIsCalculating(false)
    }
  }

  const getTerrainIcon = (terrain: string) => {
    switch (terrain) {
      case 'road':
        return '🛣️'
      case 'gravel':
        return '🪨'
      case 'trail':
        return '🌲'
      case 'downhill':
        return '⛰️'
      default:
        return '🚴'
    }
  }

  const getPressureColor = (psi: number) => {
    if (psi < 20) return 'text-error-600'
    if (psi < 30) return 'text-warning-600'
    return 'text-success-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tire Pressure Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get the perfect tire pressure for your weight, bike, and riding conditions. Optimize grip, rolling resistance, and comfort.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Setup</h2>
            
            <div className="space-y-6">
              {/* Rider Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Weight className="w-4 h-4 inline mr-2" />
                  Rider Weight (lbs)
                </label>
                <input
                  type="number"
                  value={params.riderWeight}
                  onChange={(e) => handleParamChange('riderWeight', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="80"
                  max="300"
                />
              </div>

              {/* Bike Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bike className="w-4 h-4 inline mr-2" />
                  Bike Weight (lbs)
                </label>
                <input
                  type="number"
                  value={params.bikeWeight}
                  onChange={(e) => handleParamChange('bikeWeight', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="15"
                  max="50"
                />
              </div>

              {/* Tire Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Gauge className="w-4 h-4 inline mr-2" />
                  Tire Width (inches)
                </label>
                <select
                  value={params.tireWidth}
                  onChange={(e) => handleParamChange('tireWidth', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={1.8}>1.8" (Road/Gravel)</option>
                  <option value={2.0}>2.0" (Gravel)</option>
                  <option value={2.2}>2.2" (Trail)</option>
                  <option value={2.4}>2.4" (Trail)</option>
                  <option value={2.6}>2.6" (Enduro)</option>
                  <option value={2.8}>2.8" (Downhill)</option>
                </select>
              </div>

              {/* Wheel Diameter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bike className="w-4 h-4 inline mr-2" />
                  Wheel Diameter (inches)
                </label>
                <select
                  value={params.wheelDiameter}
                  onChange={(e) => handleParamChange('wheelDiameter', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={26}>26"</option>
                  <option value={27.5}>27.5"</option>
                  <option value={29}>29"</option>
                </select>
              </div>

              {/* Terrain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Terrain Type
                </label>
                <select
                  value={params.terrain}
                  onChange={(e) => handleParamChange('terrain', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="road">Road</option>
                  <option value="gravel">Gravel</option>
                  <option value="trail">Trail</option>
                  <option value="downhill">Downhill</option>
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
                className="w-full btn-primary"
              >
                {isCalculating ? 'Calculating...' : 'Calculate Tire Pressure'}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Pressure</h2>
            
            {results ? (
              <div className="space-y-6">
                {/* Pressure Display */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Front Tire</h3>
                    <p className={`text-3xl font-bold ${getPressureColor(results.frontPSI)}`}>
                      {results.frontPSI} PSI
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Rear Tire</h3>
                    <p className={`text-3xl font-bold ${getPressureColor(results.rearPSI)}`}>
                      {results.rearPSI} PSI
                    </p>
                  </div>
                </div>

                {/* Pressure Range */}
                <div className="p-4 bg-primary-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Safe Range</h3>
                  <p className="text-sm text-gray-600">
                    {results.range.min} - {results.range.max} PSI
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
                <Gauge className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Enter your details and calculate to see recommended tire pressure</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Tire Pressure Tips</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start High</h3>
              <p className="text-gray-600">Begin with higher pressure and gradually reduce until you find the sweet spot for your riding style.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Regularly</h3>
              <p className="text-gray-600">Tire pressure can drop significantly overnight. Check before every ride for optimal performance.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Feel Matters</h3>
              <p className="text-gray-600">These are starting points. Adjust based on how the bike feels and your personal preferences.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 