import Link from 'next/link'
import { Calculator, Gauge, Link as LinkIcon, Target, CheckCircle, ArrowRight, Zap, TrendingUp, Shield } from 'lucide-react'

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
    title: 'Chain Length',
    description: 'Calculate the perfect chain length for your drivetrain. Get the right length for optimal shifting and derailleur performance.',
    icon: LinkIcon,
    href: '/calculators/chain-length',
    color: 'warning',
    features: ['Drivetrain compatibility', 'Derailleur capacity', 'Chainstay measurements', 'Installation guidance']
  },
  {
    title: 'Chainline Analysis',
    description: 'Optimize your drivetrain alignment for maximum efficiency and reduced wear. Perfect chainline means better performance.',
    icon: Target,
    href: '/calculators/chainline',
    color: 'error',
    features: ['Alignment optimization', 'Efficiency analysis', 'Frame-specific targets', 'Measurement guidance']
  }
]

const getColorClasses = (color: string) => {
  switch (color) {
    case 'primary':
      return {
        bg: 'bg-primary-100',
        text: 'text-primary-600',
        hover: 'group-hover:bg-primary-200',
        border: 'border-primary-200'
      }
    case 'success':
      return {
        bg: 'bg-success-100',
        text: 'text-success-600',
        hover: 'group-hover:bg-success-200',
        border: 'border-success-200'
      }
    case 'warning':
      return {
        bg: 'bg-warning-100',
        text: 'text-warning-600',
        hover: 'group-hover:bg-warning-200',
        border: 'border-warning-200'
      }
    case 'error':
      return {
        bg: 'bg-error-100',
        text: 'text-error-600',
        hover: 'group-hover:bg-error-200',
        border: 'border-error-200'
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
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{calculator.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {calculator.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
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
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600">Get accurate calculations in seconds, not hours of manual work or guesswork.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Proven Formulas</h3>
              <p className="text-gray-600">Based on industry-standard calculations and real-world testing data.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Focused</h3>
              <p className="text-gray-600">Every calculation is designed to improve your bike's performance and your riding experience.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to optimize your setup?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start with our most popular gear comparison calculator
          </p>
          <Link href="/calculators/gear-comparison" className="btn-primary">
            Start Comparing Gears
          </Link>
        </div>
      </div>
    </div>
  )
} 