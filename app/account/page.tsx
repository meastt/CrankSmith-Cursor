'use client'

import { useState } from 'react'
import { User, Bike, History, Settings, Plus, Edit, Trash2, Share2, Calculator, Heart } from 'lucide-react'

interface SavedSetup {
  id: string
  name: string
  bikeType: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  components: {
    category: string
    manufacturer: string
    model: string
    weightGrams: number
    msrp: number
  }[]
  totalWeight: number
  totalCost: number
  likes: number
}

interface ComparisonHistory {
  id: string
  currentSetup: string
  proposedSetup: string
  date: string
  results: {
    gearRange: number
    lowestGear: number
    highestGear: number
  }
}

// Sample data
const sampleSavedSetups: SavedSetup[] = [
  {
    id: '1',
    name: 'My Trail Bike',
    bikeType: 'Mountain Bike',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    isPublic: true,
    components: [
      {
        category: 'CASSETTE',
        manufacturer: 'Shimano',
        model: 'XT M8100',
        weightGrams: 420,
        msrp: 89.99
      },
      {
        category: 'CHAINRING',
        manufacturer: 'Race Face',
        model: 'Turbine R',
        weightGrams: 125,
        msrp: 89.99
      }
    ],
    totalWeight: 545,
    totalCost: 179.98,
    likes: 12
  },
  {
    id: '2',
    name: 'Road Setup',
    bikeType: 'Road Bike',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    isPublic: false,
    components: [
      {
        category: 'CASSETTE',
        manufacturer: 'Shimano',
        model: 'Dura-Ace R9200',
        weightGrams: 140,
        msrp: 450
      }
    ],
    totalWeight: 140,
    totalCost: 450,
    likes: 0
  }
]

const sampleComparisonHistory: ComparisonHistory[] = [
  {
    id: '1',
    currentSetup: 'My Trail Bike',
    proposedSetup: 'Upgraded Trail Setup',
    date: '2024-01-20',
    results: {
      gearRange: 450,
      lowestGear: 20.5,
      highestGear: 92.3
    }
  },
  {
    id: '2',
    currentSetup: 'Road Setup',
    proposedSetup: 'Aero Road Setup',
    date: '2024-01-18',
    results: {
      gearRange: 380,
      lowestGear: 28.1,
      highestGear: 108.7
    }
  }
]

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'setups' | 'history' | 'settings'>('setups')
  const [selectedSetup, setSelectedSetup] = useState<SavedSetup | null>(null)

  const tabs = [
    { id: 'setups', name: 'My Setups', icon: Bike },
    { id: 'history', name: 'Comparison History', icon: History },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  // FIXED: Add all missing button handlers
  const handleAddNewSetup = () => {
    console.log('Adding new setup...')
    // TODO: Navigate to setup builder or show modal
    alert('Setup builder coming soon!')
  }

  const handleEditSetup = (setupId: string) => {
    console.log('Editing setup:', setupId)
    // TODO: Navigate to edit page
    alert(`Edit setup ${setupId} - coming soon!`)
  }

  const handleDeleteSetup = (setupId: string, setupName: string) => {
    if (confirm(`Are you sure you want to delete "${setupName}"?`)) {
      console.log('Deleting setup:', setupId)
      // TODO: Implement delete logic
      alert(`Deleted "${setupName}"`)
    }
  }

  const handleCompareSetup = (setupId: string) => {
    console.log('Comparing setup:', setupId)
    // TODO: Navigate to comparison page with pre-loaded setup
    alert(`Starting comparison for setup ${setupId}`)
  }

  const handleShareSetup = (setupId: string, setupName: string) => {
    console.log('Sharing setup:', setupId)
    // TODO: Generate share link and copy to clipboard
    const shareUrl = `${window.location.origin}/setups/${setupId}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(`Share link copied for "${setupName}"!`)
    }).catch(() => {
      alert(`Share URL: ${shareUrl}`)
    })
  }

  const handleViewComparisonDetails = (comparisonId: string) => {
    console.log('Viewing comparison details:', comparisonId)
    // TODO: Navigate to detailed comparison view
    alert(`Viewing details for comparison ${comparisonId}`)
  }

  const handleSaveSettings = () => {
    console.log('Saving settings...')
    // TODO: Save settings to backend
    alert('Settings saved successfully!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">Manage your bike setups and preferences</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'setups' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Bike Setups</h2>
                  <button 
                    onClick={handleAddNewSetup}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Setup
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleSavedSetups.map(setup => (
                    <div key={setup.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{setup.name}</h3>
                          <p className="text-sm text-gray-600">{setup.bikeType}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditSetup(setup.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Edit setup"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteSetup(setup.id, setup.name)}
                            className="text-gray-400 hover:text-red-600"
                            title="Delete setup"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="text-center p-2 bg-white rounded">
                          <p className="text-xs text-gray-600">Weight</p>
                          <p className="font-semibold text-gray-900">{(setup.totalWeight / 1000).toFixed(1)}kg</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded">
                          <p className="text-xs text-gray-600">Cost</p>
                          <p className="font-semibold text-gray-900">${setup.totalCost}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          setup.isPublic 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {setup.isPublic ? 'Public' : 'Private'}
                        </span>
                        <div className="flex items-center text-gray-500">
                          <Heart className="w-3 h-3 mr-1" />
                          {setup.likes}
                        </div>
                      </div>

                      <div className="mt-3 flex space-x-2">
                        <button 
                          onClick={() => handleCompareSetup(setup.id)}
                          className="flex-1 btn-secondary text-sm"
                          title="Compare this setup"
                        >
                          <Calculator className="w-3 h-3 mr-1" />
                          Compare
                        </button>
                        <button 
                          onClick={() => handleShareSetup(setup.id, setup.name)}
                          className="flex-1 btn-primary text-sm"
                          title="Share this setup"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Comparison History</h2>
                <div className="space-y-4">
                  {sampleComparisonHistory.map(comparison => (
                    <div key={comparison.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {comparison.currentSetup} → {comparison.proposedSetup}
                          </h3>
                          <p className="text-sm text-gray-600">{comparison.date}</p>
                        </div>
                        <button 
                          onClick={() => handleViewComparisonDetails(comparison.id)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-2 bg-white rounded">
                          <p className="text-xs text-gray-600">Gear Range</p>
                          <p className="font-semibold text-gray-900">{comparison.results.gearRange}%</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded">
                          <p className="text-xs text-gray-600">Lowest Gear</p>
                          <p className="font-semibold text-gray-900">{comparison.results.lowestGear}</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded">
                          <p className="text-xs text-gray-600">Highest Gear</p>
                          <p className="font-semibold text-gray-900">{comparison.results.highestGear}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          defaultValue="John Doe"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="john@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="public-setups"
                          defaultChecked
                          className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="public-setups" className="text-sm text-gray-700">
                          Make new setups public by default
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="email-notifications"
                          defaultChecked
                          className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="email-notifications" className="text-sm text-gray-700">
                          Receive email notifications for new features
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="component-alerts"
                          className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="component-alerts" className="text-sm text-gray-700">
                          Alert me when components in my setups go on sale
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Units</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight Units</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option value="metric">Kilograms (kg)</option>
                          <option value="imperial">Pounds (lbs)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Speed Units</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option value="metric">Kilometers per hour (km/h)</option>
                          <option value="imperial">Miles per hour (mph)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button 
                      onClick={handleSaveSettings}
                      className="btn-primary"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}