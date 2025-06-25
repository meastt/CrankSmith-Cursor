import Link from 'next/link'
import { Calculator, CheckCircle, Trophy, ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              CrankSmith 4.0
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              The definitive cycling calculator platform that answers every mechanical question before you buy, build, or ride.
            </p>
            <p className="text-lg md:text-xl mb-12 text-primary-200 font-medium">
              Never buy the wrong part again.
            </p>
          </div>
        </div>
      </section>

      {/* Main Choices Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What do you want to do?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your path to cycling perfection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Calculate Gears */}
            <Link href="/calculators/gear-comparison" className="group">
              <div className="card h-full text-center group-hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <Calculator className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Calculate Gears
                </h3>
                <p className="text-gray-600 mb-6">
                  Compare your current setup with any proposed changes. See speed, climbing ability, and efficiency improvements instantly.
                </p>
                <div className="flex items-center justify-center text-primary-600 font-medium group-hover:text-primary-700">
                  <span>Most Popular</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Check Compatibility */}
            <Link href="/compatibility" className="group">
              <div className="card h-full text-center group-hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center group-hover:bg-success-200 transition-colors">
                    <CheckCircle className="w-8 h-8 text-success-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Check Compatibility
                </h3>
                <p className="text-gray-600 mb-6">
                  Will this cassette work with your hub? Our compatibility engine catches issues before you buy.
                </p>
                <div className="flex items-center justify-center text-success-600 font-medium group-hover:text-success-700">
                  <span>Unique to Us</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Browse Pro Builds */}
            <Link href="/pro-builds" className="group">
              <div className="card h-full text-center group-hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center group-hover:bg-warning-200 transition-colors">
                    <Trophy className="w-8 h-8 text-warning-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Browse Pro Builds
                </h3>
                <p className="text-gray-600 mb-6">
                  See what the pros are riding. Get inspired by verified setups from top cyclists and teams.
                </p>
                <div className="flex items-center justify-center text-warning-600 font-medium group-hover:text-warning-700">
                  <span>Inspiration & Sales</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why CrankSmith 4.0?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The most comprehensive cycling calculator platform ever built
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600">Get gear comparisons and compatibility checks in seconds, not hours.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Data</h3>
              <p className="text-gray-600">10,000+ components with real weights, measurements, and compatibility rules.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Money</h3>
              <p className="text-gray-600">Avoid buying incompatible parts. Our compatibility engine prevents costly mistakes.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Suite</h3>
              <p className="text-gray-600">Gear comparison, tire pressure, chain length, chainline analysis, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to optimize your ride?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of cyclists who trust CrankSmith to make the right component choices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculators/gear-comparison" className="btn-primary">
              Start Comparing Gears
            </Link>
            <Link href="/compatibility" className="btn-secondary">
              Check Compatibility
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CrankSmith 4.0</h3>
              <p className="text-gray-400">
                The definitive cycling calculator platform that answers every mechanical question before you buy, build, or ride.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Calculators</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/calculators/gear-comparison" className="hover:text-white">Gear Comparison</Link></li>
                <li><Link href="/calculators/tire-pressure" className="hover:text-white">Tire Pressure</Link></li>
                <li><Link href="/calculators/chain-length" className="hover:text-white">Chain Length</Link></li>
                <li><Link href="/calculators/chainline" className="hover:text-white">Chainline Analysis</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/compatibility" className="hover:text-white">Compatibility Check</Link></li>
                <li><Link href="/pro-builds" className="hover:text-white">Pro Builds</Link></li>
                <li><Link href="/guides" className="hover:text-white">Build Guides</Link></li>
                <li><Link href="/reviews" className="hover:text-white">User Reviews</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CrankSmith. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 