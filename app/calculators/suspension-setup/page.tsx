'use client'

import { useState } from 'react'
import { SuspensionCalculator, SuspensionInput, SuspensionResult, RidingStyle, BikeType, TerrainType } from '@/lib/tire-pressure-calculator'
import { SlidersHorizontal, Weight, Bike, Mountain, ArrowDownUp, RotateCcw, TrendingUp, CheckCircle, Info, Wrench } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { toast } from '@/components/ui/toast'

// Configuration for suspension-specific options
const SUSPENSION_OPTIONS = {
  full_suspension_xc: {
    label: 'XC (Full Suspension)',
    terrains: [
      { value: 'xc_trail', label: 'XC / Light Trail' },
      { value: 'trail', label: 'Rolling Hills / Flow' },
    ],
    defaults: { terrain: 'xc_trail' as TerrainType, gearWeight: 8 },
  },
  trail: {
    label: 'Trail',
    terrains: [
      { value: 'xc_trail', label: 'Flowy Singletrack' },
      { value: 'trail', label: 'All-Mountain / Varied' },
      { value: 'enduro', label: 'Technical / Chunky' },
    ],
    defaults: { terrain: 'trail' as TerrainType, gearWeight: 10 },
  },
  enduro: {
    label: 'Enduro',
    terrains: [
      { value: 'trail', label: 'Aggressive Trail' },
      { value: 'enduro', label: 'Enduro Racing / Steep' },
      { value: 'bike_park', label: 'Bike Park / Jumps' },
    ],
    defaults: { terrain: 'enduro' as TerrainType, gearWeight: 12 },
  },
  downhill: {
    label: 'Downhill',
    terrains: [
      { value: 'enduro', label: 'Freeride' },
      { value: 'downhill', label: 'Downhill Racing' },
      { value: 'bike_park', label: 'Bike Park / Maximum Gaps' },
    ],
    defaults: { terrain: 'downhill' as TerrainType, gearWeight: 15 },
  },
  hardtail_xc: {
    label: 'Hardtail',
    terrains: [
      { value: 'xc_trail', label: 'XC / Light Trail' },
      { value: 'trail', label: 'Flowy Singletrack' },
    ],
    defaults: { terrain: 'xc_trail' as TerrainType, gearWeight: 8 },
  }
};

type SuspensionBikeType = keyof typeof SUSPENSION_OPTIONS;

const PageHeader = ({ title, description, breadcrumbs }: { title: string; description: string; breadcrumbs: Array<{ label: string; href: string }> }) => (
  <div className="mb-8">
    <Breadcrumbs items={breadcrumbs} />
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-gray-600">{description}</p>
  </div>
)

export default function SuspensionSetupPage() {
  const [params, setParams] = useState({
    riderWeight: 160,
    gearWeight: 10,
    bikeType: 'trail' as SuspensionBikeType,
    ridingStyle: 'balanced' as RidingStyle,
    terrain: 'trail' as TerrainType,
    forkBrand: 'Other',
    forkModel: 'Generic',
    shockBrand: 'Other',
    shockModel: 'Generic'
  })

  const [results, setResults] = useState<SuspensionResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleBikeTypeChange = (newBikeType: SuspensionBikeType) => {
    const newDefaults = SUSPENSION_OPTIONS[newBikeType].defaults;
    setParams(prev => ({
        ...prev,
        bikeType: newBikeType,
        ...newDefaults,
    }));
    setResults(null);
  };

  const handleParamChange = (field: keyof typeof params, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }))
  }

  const calculateSettings = () => {
    setIsCalculating(true)
    
    try {
      const input: SuspensionInput = {
        riderWeight: params.riderWeight * 0.453592, // lbs to kg
        gearWeight: params.gearWeight * 0.453592, // lbs to kg
        bikeType: params.bikeType,
        ridingStyle: params.ridingStyle,
        terrain: params.terrain,
        forkBrand: params.forkBrand,
        forkModel: params.forkModel,
        shockBrand: params.shockBrand,
        shockModel: params.shockModel
      }
      const suspensionResults = SuspensionCalculator.calculateSuspensionSettings(input)
      setResults(suspensionResults)
      toast.success('Suspension settings calculated!')
    } catch (error) {
      console.error('Calculation error:', error)
      toast.error('Error calculating suspension. Please check inputs.')
    } finally {
      setIsCalculating(false)
    }
  }

  const currentBikeOptions = SUSPENSION_OPTIONS[params.bikeType];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title="Suspension Setup Calculator"
          description="Get a personalized baseline for your fork and shock settings."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Calculators', href: '/calculators' },
            { label: 'Suspension Setup', href: '/calculators/suspension-setup' }
          ]}
        />
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center"><Weight className="w-5 h-5 mr-2" />1. Rider Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rider Weight (lbs)</label>
                  <input type="number" value={params.riderWeight} onChange={(e) => handleParamChange('riderWeight', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" min="80" max="300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gear Weight (lbs)</label>
                  <input type="number" value={params.gearWeight} onChange={(e) => handleParamChange('gearWeight', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" max="40" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><Bike className="w-5 h-5 mr-2" />2. Bike & Riding Style</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bike Type</label>
                  <select value={params.bikeType} onChange={(e) => handleBikeTypeChange(e.target.value as SuspensionBikeType)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {(Object.keys(SUSPENSION_OPTIONS) as SuspensionBikeType[]).map(key => (
                      <option key={key} value={key}>{SUSPENSION_OPTIONS[key].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Terrain</label>
                  <select value={params.terrain} onChange={(e) => handleParamChange('terrain', e.target.value as TerrainType)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {currentBikeOptions.terrains.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Riding Style</label>
                  <select value={params.ridingStyle} onChange={(e) => handleParamChange('ridingStyle', e.target.value as RidingStyle)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="comfort">🛋️ Comfortable</option>
                    <option value="balanced">⚖️ Balanced / All-Around</option>
                    <option value="speed">🏃 Aggressive / Race</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <button onClick={calculateSettings} disabled={isCalculating} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                  <Wrench className="w-5 h-5 mr-2" />
                  {isCalculating ? 'Calculating...' : 'Calculate Baseline Settings'}
                </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Baseline Settings</h2>
                    <div className="space-y-6">
                        {/* Fork Results */}
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <h3 className="font-semibold text-gray-900 mb-3 text-lg">Fork Settings</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div><p className="text-sm text-gray-500">Pressure</p><p className="text-2xl font-bold text-blue-600">{results.fork.pressure}<span className="text-base font-medium ml-1">PSI</span></p></div>
                                <div><p className="text-sm text-gray-500">Sag</p><p className="text-2xl font-bold text-blue-600">{results.fork.sagPercentage}<span className="text-base font-medium">%</span></p></div>
                                <div><p className="text-sm text-gray-500">Rebound</p><p className="text-2xl font-bold text-blue-600">{results.fork.reboundClicks}<span className="text-base font-medium ml-1">clicks</span></p></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 text-center">Rebound clicks are from fully closed (slowest setting).</p>
                        </div>
                        {/* Shock Results */}
                        {results.shock.pressure > 0 ? (
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Shock Settings</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div><p className="text-sm text-gray-500">Pressure</p><p className="text-2xl font-bold text-green-600">{results.shock.pressure}<span className="text-base font-medium ml-1">PSI</span></p></div>
                                    <div><p className="text-sm text-gray-500">Sag</p><p className="text-2xl font-bold text-green-600">{results.shock.sagPercentage}<span className="text-base font-medium">%</span></p></div>
                                    <div><p className="text-sm text-gray-500">Rebound</p><p className="text-2xl font-bold text-green-600">{results.shock.reboundClicks}<span className="text-base font-medium ml-1">clicks</span></p></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3 text-center">Rebound clicks are from fully closed (slowest setting).</p>
                            </div>
                        ) : (
                           <div className="p-4 bg-gray-100 rounded-lg border border-dashed text-center">
                                <p className="text-sm font-medium text-gray-700">Hardtail selected, no rear shock settings required.</p>
                           </div>
                        )}
                    </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center"><TrendingUp className="w-4 h-4 mr-2" />Setup Recommendations</h3>
                  <div className="space-y-2 text-sm text-green-700">
                    {results.recommendations.map((rec, index) => ( <div key={index} className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" /> <p>{rec}</p></div>))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center"><Info className="w-4 h-4 mr-2 text-blue-600" />Setup Notes</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {results.setupNotes.map((note, index) => ( <div key={index} className="flex items-start"><span className="mr-2">💡</span><p>{note}</p></div>))}
                  </div>
                </div>
              </>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-gray-600 mb-4">This calculator provides a starting point. Your final perfect setup may vary based on your specific suspension model and personal feel.</p>
                    <div className="space-y-4">
                        <div className="flex items-start"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0"><span className="font-semibold text-blue-600">1</span></div><div><h3 className="font-semibold text-gray-900">Enter Your Details</h3><p className="text-sm text-gray-600">Input your weight and select your bike type and primary riding style.</p></div></div>
                        <div className="flex items-start"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0"><span className="font-semibold text-blue-600">2</span></div><div><h3 className="font-semibold text-gray-900">Get Your Baseline</h3><p className="text-sm text-gray-600">Receive scientifically calculated starting points for pressure, sag, and rebound.</p></div></div>
                        <div className="flex items-start"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0"><span className="font-semibold text-blue-600">3</span></div><div><h3 className="font-semibold text-gray-900">Fine-Tune on the Trail</h3><p className="text-sm text-gray-600">Use our recommendations to set your bike, then make small adjustments on your ride to dial it in perfectly.</p></div></div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}