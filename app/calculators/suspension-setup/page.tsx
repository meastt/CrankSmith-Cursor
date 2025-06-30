'use client'

import { useState } from 'react'
import { SuspensionCalculator, SuspensionInput, SuspensionResult, RidingStyle, BikeType, TerrainType } from '@/lib/tire-pressure-calculator'
import { SlidersHorizontal, Weight, Bike, Settings, TrendingUp, CheckCircle, Info, Wrench } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { toast } from '@/components/ui/toast'

const SUSPENSION_BRAND_OPTIONS = {
    'RockShox': ['Lyrik/Pike/ZEB (Charger 3)', 'SID (Charger Race Day)', 'Generic'],
    'Fox': ['36/38 (GRIP2)', '34 (FIT4)', 'Float X / DPX2', 'Float X2', 'Generic'],
    'Other': ['Generic'],
};

const BIKE_TYPE_OPTIONS: { value: BikeType, label: string }[] = [
    { value: 'full_suspension_xc', label: 'XC (Full Suspension)' },
    { value: 'trail', label: 'Trail' },
    { value: 'enduro', label: 'Enduro' },
    { value: 'downhill', label: 'Downhill' },
    { value: 'hardtail_xc', label: 'Hardtail' }
];

const PageHeader = ({ title, description, breadcrumbs }: { title: string; description: string; breadcrumbs: Array<{ label: string; href: string }> }) => (
  <div className="mb-8"> <Breadcrumbs items={breadcrumbs} /> <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1> <p className="text-gray-600">{description}</p> </div>
)

export default function SuspensionSetupPage() {
  const [params, setParams] = useState({
    riderWeight: 160, gearWeight: 10,
    bikeType: 'trail' as BikeType,
    ridingStyle: 'balanced' as RidingStyle,
    terrain: 'trail' as TerrainType,
    forkBrand: 'RockShox', forkModel: 'Lyrik/Pike/ZEB (Charger 3)',
    shockBrand: 'RockShox', shockModel: 'Generic'
  })

  const [results, setResults] = useState<SuspensionResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleParamChange = (field: keyof typeof params, value: any) => {
    const newParams = { ...params, [field]: value };

    // Reset model if brand changes
    if (field === 'forkBrand') {
        newParams.forkModel = SUSPENSION_BRAND_OPTIONS[value as keyof typeof SUSPENSION_BRAND_OPTIONS][0];
    }
    if (field === 'shockBrand') {
        newParams.shockModel = SUSPENSION_BRAND_OPTIONS[value as keyof typeof SUSPENSION_BRAND_OPTIONS][0];
    }
    if (field === 'bikeType' && value === 'hardtail_xc') {
        newParams.shockBrand = 'Other';
        newParams.shockModel = 'Generic';
    }

    setParams(newParams);
  }

  const calculateSettings = () => {
    setIsCalculating(true)
    try {
      const input: SuspensionInput = {
        riderWeight: params.riderWeight * 0.453592, gearWeight: params.gearWeight * 0.453592,
        bikeType: params.bikeType, ridingStyle: params.ridingStyle, terrain: params.terrain,
        forkBrand: params.forkBrand, forkModel: params.forkModel,
        shockBrand: params.shockBrand, shockModel: params.shockModel
      }
      const suspensionResults = SuspensionCalculator.calculateSuspensionSettings(input)
      setResults(suspensionResults)
      toast.success('Suspension settings calculated!')
    } catch (error) {
      console.error('Calculation error:', error)
      toast.error('Error calculating suspension. Please check inputs.')
    } finally { setIsCalculating(false) }
  }

  const forkModelOptions = SUSPENSION_BRAND_OPTIONS[params.forkBrand as keyof typeof SUSPENSION_BRAND_OPTIONS] || [];
  const shockModelOptions = SUSPENSION_BRAND_OPTIONS[params.shockBrand as keyof typeof SUSPENSION_BRAND_OPTIONS] || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title="Suspension Setup Calculator"
          description="Get a personalized baseline for your fork and shock, tailored to your specific hardware."
          breadcrumbs={[
            { label: 'Home', href: '/' }, { label: 'Calculators', href: '/calculators' },
            { label: 'Suspension Setup', href: '/calculators/suspension-setup' }
          ]}
        />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center"><Weight className="w-5 h-5 mr-2" />1. Rider Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Rider Weight (lbs)</label><input type="number" value={params.riderWeight} onChange={(e) => handleParamChange('riderWeight', parseInt(e.target.value) || 0)} className="w-full input" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Gear Weight (lbs)</label><input type="number" value={params.gearWeight} onChange={(e) => handleParamChange('gearWeight', parseInt(e.target.value) || 0)} className="w-full input" /></div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><Bike className="w-5 h-5 mr-2" />2. Bike & Hardware</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Bike Type</label><select value={params.bikeType} onChange={(e) => handleParamChange('bikeType', e.target.value)} className="w-full input">{BIKE_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Riding Style</label><select value={params.ridingStyle} onChange={(e) => handleParamChange('ridingStyle', e.target.value)} className="w-full input"><option value="comfort">🛋️ Comfortable</option><option value="balanced">⚖️ Balanced</option><option value="speed">🏃 Aggressive / Race</option></select></div>
                
                <div className="col-span-1 border-t pt-4 mt-4 md:col-span-2 md:border-t-0 md:pt-0 md:mt-0">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fork Brand</label>
                    <select value={params.forkBrand} onChange={(e) => handleParamChange('forkBrand', e.target.value)} className="w-full input">{Object.keys(SUSPENSION_BRAND_OPTIONS).map(brand => <option key={brand} value={brand}>{brand}</option>)}</select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fork Model</label>
                    <select value={params.forkModel} onChange={(e) => handleParamChange('forkModel', e.target.value)} className="w-full input">{forkModelOptions.map(model => <option key={model} value={model}>{model}</option>)}</select>
                </div>

                <div className="col-span-1 border-t pt-4 mt-4 md:col-span-2 md:border-t-0 md:pt-0 md:mt-0">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shock Brand</label>
                    <select value={params.shockBrand} onChange={(e) => handleParamChange('shockBrand', e.target.value)} className="w-full input" disabled={params.bikeType === 'hardtail_xc'}>{Object.keys(SUSPENSION_BRAND_OPTIONS).map(brand => <option key={brand} value={brand}>{brand}</option>)}</select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shock Model</label>
                    <select value={params.shockModel} onChange={(e) => handleParamChange('shockModel', e.target.value)} className="w-full input" disabled={params.bikeType === 'hardtail_xc'}>{shockModelOptions.map(model => <option key={model} value={model}>{model}</option>)}</select>
                </div>
              </div>
            </div>
            <div className="p-6"><button onClick={calculateSettings} disabled={isCalculating} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"><Wrench className="w-5 h-5 mr-2" />{isCalculating ? 'Calculating...' : 'Calculate Baseline Settings'}</button></div>
          </div>
          <div className="space-y-6">
            {results ? (
              <>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Baseline</h2>
                    <div className="space-y-6">
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <h3 className="font-semibold text-gray-900 mb-3 text-lg">Fork: {params.forkBrand} {params.forkModel}</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div><p className="text-sm text-gray-500">Pressure</p><p className="text-2xl font-bold text-blue-600">{results.fork.pressure}<span className="text-base ml-1">PSI</span></p></div>
                                <div><p className="text-sm text-gray-500">Sag</p><p className="text-2xl font-bold text-blue-600">{results.fork.sagPercentage}<span className="text-base ml-1">%</span></p></div>
                                <div><p className="text-sm text-gray-500">Rebound</p><p className="text-2xl font-bold text-blue-600">{results.fork.reboundClicks}<span className="text-base ml-1">clicks</span></p></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 text-center">Rebound clicks from fully closed (slowest).</p>
                            {results.fork.notes.length > 0 && <div className="mt-3 border-t pt-3 space-y-1">{results.fork.notes.map((note, i) => <p key={i} className="text-xs text-gray-600 text-center">💡 {note}</p>)}</div>}
                        </div>
                        {params.bikeType !== 'hardtail_xc' && (
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Shock: {params.shockBrand} {params.shockModel}</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div><p className="text-sm text-gray-500">Pressure</p><p className="text-2xl font-bold text-green-600">{results.shock.pressure}<span className="text-base ml-1">PSI</span></p></div>
                                    <div><p className="text-sm text-gray-500">Sag</p><p className="text-2xl font-bold text-green-600">{results.shock.sagPercentage}<span className="text-base ml-1">%</span></p></div>
                                    <div><p className="text-sm text-gray-500">Rebound</p><p className="text-2xl font-bold text-green-600">{results.shock.reboundClicks}<span className="text-base ml-1">clicks</span></p></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3 text-center">Rebound clicks from fully closed (slowest).</p>
                                {results.shock.notes.length > 0 && <div className="mt-3 border-t pt-3 space-y-1">{results.shock.notes.map((note, i) => <p key={i} className="text-xs text-gray-600 text-center">💡 {note}</p>)}</div>}
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center"><TrendingUp className="w-4 h-4 mr-2" />Setup Process</h3>
                  <div className="space-y-2 text-sm text-green-700">{results.recommendations.map((rec, i) => ( <div key={i} className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" /> <p>{rec}</p></div>))}</div>
                </div>
              </>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center"><Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h2 className="text-xl font-bold text-gray-900 mb-2">Your Setup Awaits</h2><p className="text-gray-600">Enter your details and hardware to get a personalized suspension tune.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}