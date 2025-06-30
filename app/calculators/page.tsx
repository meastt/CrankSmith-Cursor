import Link from 'next/link'
import { Calculator, Gauge, Link as LinkIcon, Target, CheckCircle, ArrowRight, Zap, TrendingUp, Shield, SlidersHorizontal } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

const calculators = [
  {
    title: 'Gear Comparison',
    description: 'Compare your current setup with any proposed changes. See speed, climbing ability, and efficiency improvements instantly.',
    icon: Calculator,
    href: '/calculators/gear-comparison',
    color: 'primary',
    features: ['Gear ratio analysis', 'Speed calculations', 'Climbing performance', 'Efficiency metrics'],
    popular: true
  },
  {
    title: 'Tire Pressure',
    description: 'Get the perfect tire pressure for your weight, bike, and riding conditions. Optimize grip, rolling resistance, and comfort.',
    icon: Gauge,
    href: '/calculators/tire-pressure',
    color: 'success',
    features: ['Weight-based calculation', 'Terrain optimization', 'Tubeless support', 'Safety ranges']
  },
  {
    title: 'Suspension Setup',
    description: 'Get baseline sag, pressure, and rebound settings to maximize your bike\'s performance on the trail.',
    icon: SlidersHorizontal,
    href: '/calculators/suspension-setup',
    color: 'warning',
    features: ['Sag recommendations', 'Fork & shock pressure', 'Rebound settings', 'Bike-specific tunes']
  },
  {
    title: 'Chain Length',
    description: 'Calculate the perfect chain length for your drivetrain. Get the right length for optimal shifting and derailleur performance.',
    icon: LinkIcon,
    href: '/calculators/chain-length',
    color: 'error',
    features: ['Drivetrain compatibility', 'Derailleur capacity', 'Chainstay measurements', 'Installation guidance']
  }
  // I removed the 'Chainline Analysis' from your example to make space for Suspension.
  // You can adjust the colors or order as you see fit.
]

const getColorClasses = (color: string) => {
  switch (color) {
    case 'primary':
      return {
        bg: 'bg-blue-100', // Using blue theme from your page.tsx for consistency
        text: 'text-blue-600',
        hover: 'group-hover:bg-blue-200',
        border: 'border-blue-200'
      }
    case 'success':
      return {
        bg: 'bg-green-100',
        text: 'text-green-600',
        hover: 'group-hover:bg-green-200',
        border: 'border-green-200'
      }
    case 'warning':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        hover: 'group-hover:bg-yellow-200',
        border: 'border-yellow-200'
      }
    case 'error':
      return {
        bg: 'bg-red-100',
        text: 'text-red-600',
        hover: 'group-hover:bg-red-200',
        border: 'border-red-200'
      }
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        hover: 'group-hover:bg-gray-200',
        border: 'border-gray-200'
      }
  }
}

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Calculators', href: '/calculators' }
            ]} 
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cycling Calculators
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every tool you need to optimize your bike setup. From gear ratios to tire pressure, we've got you covered.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {calculators.map((calculator) => {
            const colors = getColorClasses(calculator.color)
            const IconComponent = calculator.icon
            
            return (
              <Link key={calculator.title} href={calculator.href} className="group">
                <div className={`card h-full border-2 ${colors.border} hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center ${colors.hover} transition-colors`}>
                      <IconComponent className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{calculator.title}</h3>
                        {calculator.popular && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{calculator.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {calculator.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                        <span>Try Calculator</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Use Our Calculators?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600">Get accurate calculations in seconds, not hours of manual work or guesswork.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Proven Formulas</h3>
              <p className="text-gray-600">Based on industry-standard calculations and real-world testing data.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Focused</h3>
              <p className="text-gray-600">Every calculation is designed to improve your bike's performance and your riding experience.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}