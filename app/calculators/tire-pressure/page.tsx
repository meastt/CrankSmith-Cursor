'use client'

import { useState } from 'react'
import { TirePressureCalculator, TirePressureParams, TirePressureResult } from '@/lib/tire-pressure-calculator'
import { Gauge, Weight, Bike, Settings, TrendingUp, AlertTriangle, CheckCircle, Info, Droplets, Mountain } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { toast } from '@/components/ui/toast'

// Configuration for discipline-specific options
const BIKE_SETUP_OPTIONS = {
  road: {
    label: 'Road',
    icon: '🛣️',
    terrains: [
      { value: 'road', label: 'Smooth Pavement' },
      { value: 'road_rough', label: 'Rough Pavement / Cobbles' },
    ],
    wheelDiameters: [{ value: 28, label: '700C (28")' }],
    tireWidths: [
      { value: 23, label: '23mm' },
      { value: 25, label: '25mm' },
      { value: 28, label: '28mm (Typical)' },
      { value: 30, label: '30mm' },
      { value: 32, label: '32mm' },
    ],
    defaults: {
      terrain: 'road',
      wheelDiameter: 28,
      tireWidth: 28,
      bikeWeight: 18,
    },
  },
  gravel: {
    label: 'Gravel',
    icon: '🪨',
    terrains: [
      { value: 'gravel', label: 'Hardpack / Smooth Gravel' },
      { value: 'gravel_rough', label: 'Loose / Chunky Gravel' },
      { value: 'trail', label: 'Light Singletrack' },
    ],
    wheelDiameters: [
      { value: 28, label: '700C (28")' },
      { value: 27.5, label: '650B (27.5")' },
    ],
    tireWidths: [
      { value: 38, label: '38mm' },
      { value: 40, label: '40mm' },
      { value: 42, label: '42mm (Typical)' },
      { value: 45, label: '45mm' },
      { value: 47, label: '47mm' },
      { value: 50, label: '50mm / ~2.0"' },
    ],
    defaults: {
      terrain: 'gravel',
      wheelDiameter: 28,
      tireWidth: 42,
      bikeWeight: 22,
    },
  },
  mtb: {
    label: 'Mountain',
    icon: '⛰️',
    terrains: [
      { value: 'xc_trail', label: 'XC / Light Trail' },
      { value: 'trail', label: 'Trail / All-Mountain' },
      { value: 'enduro', label: 'Enduro' },
      { value: 'downhill', label: 'Downhill / Bike Park' },
    ],
    wheelDiameters: [
      { value: 29, label: '29"' },
      { value: 27.5, label: '27.5"' },
      { value: 26, label: '26" (Legacy)' },
    ],
    tireWidths: [
      { value: 56, label: '2.2"' },
      { value: 58, label: '2.3"' },
      { value: 61, label: '2.4" (Typical)' },
      { value: 64, label: '2.5"' },
      { value: 66, label: '2.6"' },
      { value: 71, label: '2.8"' },
    ],
    defaults: {
      terrain: 'trail',
      wheelDiameter: 29,
      tireWidth: 61, // ~2.4" in mm
      bikeWeight: 30,
    },
  },
};

type Discipline = keyof typeof BIKE_SETUP_OPTIONS;


// Page Header Component
const PageHeader = ({ title, description, breadcrumbs }: { title: string; description: string; breadcrumbs: Array<{ label: string; href: string }> }) => (
  <div className="mb-8">
    <Breadcrumbs items={breadcrumbs} />
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-gray-600">{description}</p>
  </div>
)

export default function TirePressurePage() {
  const [discipline, setDiscipline] = useState<Discipline>('gravel');
  
  const [params, setParams] = useState<TirePressureParams>({
    riderWeight: 160,
    ...BIKE_SETUP_OPTIONS.gravel.defaults,
    tubeless: true,
    conditions: 'dry',
    priority: 'balanced'
  })

  const [results, setResults] = useState<TirePressureResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleDisciplineChange = (newDiscipline: Discipline) => {
    setDiscipline(newDiscipline);
    const newDefaults = BIKE_SETUP_OPTIONS[newDiscipline].defaults;
    setParams(prev => ({
        ...prev,
        ...newDefaults,
    }));
    setResults(null); // Clear previous results to avoid confusion
  };

  const handleParamChange = (field: keyof TirePressureParams, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }))
  }

  const calculatePressure = () => {
    setIsCalculating(true)
    
    try {
      // The calculator is smart enough to handle the simplified params
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

  const getPressureColor = (psi: number, terrain: string) => {
    // Determine the broader discipline (road, gravel, mtb) for range checks
    let currentDiscipline: Discipline = 'mtb';
    if (terrain.includes('road')) currentDiscipline = 'road';
    if (terrain.includes('gravel')) currentDiscipline = 'gravel';

    const ranges = {
      road: { low: 60, high: 110 },
      gravel: { low: 25, high: 55 },
      mtb: { low: 18, high: 35 },
    }
    
    const range = ranges[currentDiscipline];
    
    if (psi < range.low * 0.9) return 'text-red-600'
    if (psi < range.low) return 'text-yellow-600'
    if (psi > range.high * 1.1) return 'text-red-600'
    if (psi > range.high) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const currentOptions = BIKE_SETUP_OPTIONS[discipline];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title="Advanced Tire Pressure Calculator"
          description="Get scientifically accurate tire pressure recommendations based on your weight, bike setup, terrain, and riding style. Optimized for Road, Gravel, and MTB."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Calculators', href: '/calculators' },
            { label: 'Tire Pressure', href: '/calculators/tire-pressure' }
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            {/* Discipline & Rider Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Bike className="w-5 h-5 mr-2" />
                  1. Choose Your Discipline
                </h2>
                <div className="flex rounded-lg border p-1 bg-gray-100">
                  {(Object.keys(BIKE_SETUP_OPTIONS) as Discipline[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => handleDisciplineChange(key)}
                      className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center space-x-2 ${
                        discipline === key
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'bg-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>{BIKE_SETUP_OPTIONS[key].icon}</span>
                      <span>{BIKE_SETUP_OPTIONS[key].label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Weight className="w-5 h-5 mr-2" />
                  2. Rider & Bike Weight
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
            </div>

            {/* Bike Setup */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                3. Bike & Tire Setup
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terrain Type
                  </label>
                  <select
                    value={params.terrain}
                    onChange={(e) => handleParamChange('terrain', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {currentOptions.terrains.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wheel Size
                  </label>
                  <select
                    value={params.wheelDiameter}
                    onChange={(e) => handleParamChange('wheelDiameter', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {currentOptions.wheelDiameters.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tire Width
                  </label>
                  <select
                    value={params.tireWidth}
                    onChange={(e) => handleParamChange('tireWidth', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {currentOptions.tireWidths.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Riding Conditions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Mountain className="w-5 h-5 mr-2" />
                4. Conditions & Preference
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surface
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Riding Priority
                    </label>
                    <select
                      value={params.priority}
                      onChange={(e) => handleParamChange('priority', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="comfort">🛋️ Comfort</option>
                      <option value="balanced">⚖️ Balanced</option>
                      <option value="speed">🏃 Speed</option>
                      <option value="grip">🤝 Max Grip</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={params.tubeless}
                      onChange={(e) => handleParamChange('tubeless', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Tubeless Setup</span>
                  </label>
                </div>
                <button
                  onClick={calculatePressure}
                  disabled={isCalculating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Optimal Pressure'}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
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
                    <div className="text-center p-4 bg-gray-50 rounded-lg border">
                      <h3 className="font-semibold text-gray-900 mb-2">Front Tire</h3>
                      <p className={`text-4xl font-bold ${getPressureColor(results.frontPSI, params.terrain)}`}>
                        {results.frontPSI} <span className="text-lg">PSI</span>
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg border">
                      <h3 className="font-semibold text-gray-900 mb-2">Rear Tire</h3>
                      <p className={`text-4xl font-bold ${getPressureColor(results.rearPSI, params.terrain)}`}>
                        {results.rearPSI} <span className="text-lg">PSI</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Fine-Tuning Range</h3>
                    <p className="text-sm text-gray-700">
                      Front: <span className="font-medium">{results.range.front.min} - {results.range.front.max} PSI</span>
                      <br/>
                      Rear: <span className="font-medium">{results.range.rear.min} - {results.range.rear.max} PSI</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Adjust within this range based on personal preference and conditions.
                    </p>
                  </div>
                </div>

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
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="w-4 h-4 mr-2 text-blue-600" />
                    Analysis & Notes
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {results.terrainNotes.map((note, index) => (
                        <p key={index}>{note}</p>
                    ))}
                    {results.setupNotes.map((note, index) => (
                        <p key={index}>{note}</p>
                    ))}
                  </div>
                </div>

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
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
                <div className="space-y-4">
                  <p className="text-gray-600">Our calculator uses a physics-based model, considering factors like tire casing drop and system weight to find the optimal balance between grip, comfort, and rolling resistance.</p>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-600">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Choose Your Discipline</h3>
                      <p className="text-sm text-gray-600">Select Road, Gravel, or MTB to get relevant options for your bike.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-600">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Enter Your Setup Details</h3>
                      <p className="text-sm text-gray-600">Provide your weight and select your specific bike and tire setup.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-600">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Get Precise Recommendations</h3>
                      <p className="text-sm text-gray-600">Receive scientifically calculated pressures plus tips for fine-tuning.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-2">Why Accurate Pressure Matters</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Too High:</strong> Harsh ride, reduced traction, higher puncture risk.</li>
                    <li>• <strong>Too Low:</strong> Pinch flats, poor rolling efficiency, potential rim damage.</li>
                    <li>• <strong>Just Right:</strong> The perfect blend of grip, comfort, speed, and tire life.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Reference Chart */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">General Pressure Guidelines</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { terrain: 'Road', icon: '🛣️', range: '60-100 PSI', tires: '25-32mm' },
              { terrain: 'Gravel', icon: '🪨', range: '25-50 PSI', tires: '38-50mm' },
              { terrain: 'XC MTB', icon: '🌲', range: '22-28 PSI', tires: '2.2"-2.4"' },
              { terrain: 'Trail MTB', icon: '⛰️', range: '20-26 PSI', tires: '2.3"-2.5"' },
              { terrain: 'Enduro MTB', icon: '🏔️', range: '19-25 PSI', tires: '2.4"-2.6"' },
              { terrain: 'Downhill MTB', icon: '⬇️', range: '18-24 PSI', tires: '2.4"-2.8"' }
            ].map((item, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg border">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm">{item.terrain}</h3>
                <p className="text-sm text-blue-600 font-medium">{item.range}</p>
                <p className="text-xs text-gray-500">{item.tires}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            * Ranges are general estimates. Use the calculator above for a personalized recommendation.
          </p>
        </div>
      </div>
    </div>
  )
}