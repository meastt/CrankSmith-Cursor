'use client'

import { useState } from 'react'
import { GearCalculator } from '@/lib/gear-calculator'
import { BikeSetup, Component, type ComparisonResults, CalculatorParams, ChainlineResult, ChainLengthResult } from '@/types/gear-calculator'
import { ArrowRight, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Weight, DollarSign, Zap, Settings, Bike, Ruler, Wind, Link, Target } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { toast } from '@/components/ui/toast'

// (Assuming PageHeader, sampleComponents, etc. are defined as before)
// Sample data for demo - in real app this would come from database
const sampleComponents: Component[] = [
  { id: '1', manufacturer: 'Shimano', model: 'XT M8100', weightGrams: 420, msrp: 89.99, category: 'CASSETTE', cassette: { speeds: 12, cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 40, 45], freehubType: 'MICRO_SPLINE' } },
  { id: '2', manufacturer: 'SRAM', model: 'GX Eagle', weightGrams: 390, msrp: 95.00, category: 'CASSETTE', cassette: { speeds: 12, cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 52], freehubType: 'SRAM_XD' } },
  { id: '3', manufacturer: 'Race Face', model: 'Turbine R 32T', weightGrams: 125, msrp: 89.99, category: 'CHAINRING', chainring: { teeth: 32, bcd: 104, offset: 6 } },
  { id: '4', manufacturer: 'Race Face', model: 'Turbine R 34T', weightGrams: 135, msrp: 89.99, category: 'CHAINRING', chainring: { teeth: 34, bcd: 104, offset: 6 } },
  { id: '5', manufacturer: 'Shimano', model: 'XT M8100 Crank', weightGrams: 280, msrp: 129.99, category: 'CRANKSET', crankset: { chainrings: [32], bcd: 104, spindleType: 'HOLLOWTECH_II', offset: 3 } },
  { id: '6', manufacturer: 'SRAM', model: 'GX Eagle Crank', weightGrams: 310, msrp: 145.00, category: 'CRANKSET', crankset: { chainrings: [34], bcd: 104, spindleType: 'DUB', offset: 6 } },
];

const PageHeader = ({ title, description, breadcrumbs }: { title: string; description: string; breadcrumbs: Array<{ label: string; href: string }> }) => (
  <div className="mb-8">
    <Breadcrumbs items={breadcrumbs} />
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-gray-600">{description}</p>
  </div>
);

// MODIFIED: ComponentSelector handles crankset correctly
function ComponentSelector({ title, setup, onSetupChange, components }: { title: string, setup: BikeSetup, onSetupChange: (setup: BikeSetup) => void, components: Component[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('CASSETTE')
  const categories = ['CASSETTE', 'CHAINRING', 'CRANKSET']
  const filteredComponents = components.filter(comp => comp.category === selectedCategory)

  const handleComponentSelect = (component: Component) => {
    const newSetup = { ...setup }
    switch (component.category) {
      case 'CASSETTE': newSetup.cassette = component; break;
      case 'CHAINRING': newSetup.chainring = component; break;
      case 'CRANKSET': newSetup.crankset = component; break; // Correctly set crankset
      default: break;
    }
    onSetupChange(newSetup);
  }

  const getSelectedComponent = () => {
    switch (selectedCategory) {
      case 'CASSETTE': return setup.cassette;
      case 'CHAINRING': return setup.chainring;
      case 'CRANKSET': return setup.crankset; // Correctly get crankset
      default: return null;
    }
  }

  const selectedComponent = getSelectedComponent();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {category}
            </button>
          ))}
        </div>
      </div>
      {selectedComponent && (
        <div className="mb-4 p-3 bg-primary-50 rounded-lg">
          <p className="font-medium text-gray-900">{selectedComponent.manufacturer} {selectedComponent.model}</p>
          <p className="text-sm text-gray-600">{selectedComponent.weightGrams}g • ${selectedComponent.msrp}</p>
        </div>
      )}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredComponents.map((component) => {
          const isSelected = selectedComponent?.id === component.id;
          return (
            <div key={component.id} onClick={() => handleComponentSelect(component)} className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <p className="font-medium text-gray-900">{component.manufacturer} {component.model}</p>
              <p className="text-sm text-gray-600">{component.weightGrams}g • ${component.msrp}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// MODIFIED: Results component now displays chainline and chain length
function ComparisonResultsDisplay({ results, params }: { results: ComparisonResults | null, params: CalculatorParams }) {
  if (!results) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Select components and enter bike parameters to see comparison results.</p>
      </div>
    )
  }
  const { performance, weight, compatibility, cost, chainLength, chainline } = results;
  const contextText = `at ${params.cadence} RPM, ${params.wheelDiameter}" wheel`;

  return (
    <div className="space-y-6">
      {/* Performance */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center"><Zap className="w-5 h-5 text-primary-600 mr-2" /> Performance</h3>
        <p className="text-xs text-gray-500 mb-4 ml-7">Calculated {contextText}</p>
        {/* Cards for top speed, climbing, range */}
      </div>

      {/* Weight & Cost */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Weight className="w-5 h-5 text-primary-600 mr-2" /> Total Weight</h3>
          {/* Weight details */}
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><DollarSign className="w-5 h-5 text-primary-600 mr-2" /> Total Cost</h3>
          {/* Cost details */}
        </div>
      </div>
      
      {/* NEW: Drivetrain Geometry Section */}
      {chainline && chainLength && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Ruler className="w-5 h-5 text-primary-600 mr-2" /> Drivetrain Geometry</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center"><Target className="w-4 h-4 mr-2"/>Chainline</h4>
              <p>Deviation: <span className="font-bold">{chainline.deviation.toFixed(1)}mm</span></p>
              <p>Efficiency: <span className="font-bold">{chainline.efficiency.toFixed(1)}%</span></p>
              <p className="text-xs text-gray-500 mt-1">{chainline.recommendations[0]}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center"><Link className="w-4 h-4 mr-2"/>Chain Length</h4>
              <p>Recommended Links: <span className="font-bold">{chainLength.links}</span></p>
              <p>Acceptable Range: <span className="font-bold">{chainLength.tolerance.min} - {chainLength.tolerance.max} links</span></p>
              <p className="text-xs text-gray-500 mt-1">{chainLength.notes[0]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Compatibility */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          {compatibility.isCompatible ? <CheckCircle className="w-5 h-5 text-green-600 mr-2" /> : <XCircle className="w-5 h-5 text-red-600 mr-2" />}
          Compatibility
        </h3>
        {/* Compatibility details */}
      </div>
    </div>
  )
}

export default function GearComparisonPage() {
  const [currentSetup, setCurrentSetup] = useState<BikeSetup>({})
  const [proposedSetup, setProposedSetup] = useState<BikeSetup>({})
  const [results, setResults] = useState<ComparisonResults | null>(null)
  const [params, setParams] = useState<CalculatorParams>({
    wheelDiameter: 29,
    cadence: 90,
    chainstayLength: 435
  });

  const handleParamChange = (field: keyof CalculatorParams, value: any) => {
    setParams(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  }

  const handleCompare = () => {
    if (!currentSetup.cassette || (!currentSetup.chainring && !currentSetup.crankset) || !proposedSetup.cassette || (!proposedSetup.chainring && !proposedSetup.crankset)) {
      toast.error('Please select a cassette and a chainring/crankset for both setups.');
      return;
    }
    const comparisonResults = GearCalculator.compareSetups(currentSetup, proposedSetup, params);
    setResults(comparisonResults);
    toast.success('Gear comparison completed successfully!');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title="Gear Comparison Calculator"
          description="Compare your current drivetrain with any proposed changes. See performance, weight, and compatibility differences instantly."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Calculators', href: '/calculators' }, { label: 'Gear Comparison', href: '/calculators/gear-comparison' }]}
        />
        
        {/* NEW: User Parameter Inputs */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Bike className="w-5 h-5 text-primary-600 mr-2" /> Your Bike & Riding Style</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wheel Diameter (in)</label>
              <input type="number" value={params.wheelDiameter} onChange={e => handleParamChange('wheelDiameter', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typical Cadence (RPM)</label>
              <input type="number" value={params.cadence} onChange={e => handleParamChange('cadence', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chainstay Length (mm)</label>
              <input type="number" value={params.chainstayLength} onChange={e => handleParamChange('chainstayLength', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ComponentSelector title="Current Setup" setup={currentSetup} onSetupChange={setCurrentSetup} components={sampleComponents} />
          <ComponentSelector title="Proposed Setup" setup={proposedSetup} onSetupChange={setProposedSetup} components={sampleComponents} />
        </div>

        <div className="text-center mb-8">
          <button onClick={handleCompare} className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            Compare Setups <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        <ComparisonResultsDisplay results={results} params={params} />
      </div>
    </div>
  )
}