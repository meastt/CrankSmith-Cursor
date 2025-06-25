'use client'

import { useState } from 'react'
import { Bike, Trophy, Star, ExternalLink, Filter, Search, Heart, Share2, Calculator } from 'lucide-react'

interface ProBuild {
  id: string
  rider: string
  team: string
  discipline: 'road' | 'mtb' | 'gravel' | 'cyclocross' | 'enduro' | 'downhill'
  bike: string
  year: number
  verified: boolean
  totalWeight: number
  totalCost: number
  imageUrl: string
  description: string
  components: {
    category: string
    manufacturer: string
    model: string
    weightGrams: number
    msrp: number
    affiliateUrl?: string
  }[]
  tags: string[]
  likes: number
  verifiedDate: string
}

// Sample pro builds data
const sampleProBuilds: ProBuild[] = [
  {
    id: '1',
    rider: 'Mathieu van der Poel',
    team: 'Alpecin-Deceuninck',
    discipline: 'cyclocross',
    bike: 'Canyon Inflite CF SLX',
    year: 2024,
    verified: true,
    totalWeight: 7200,
    totalCost: 12500,
    imageUrl: 'https://example.com/mvdp-bike.jpg',
    description: 'Van der Poel\'s World Championship winning cyclocross setup. Optimized for power transfer and mud clearance.',
    components: [
      {
        category: 'CASSETTE',
        manufacturer: 'Shimano',
        model: 'Dura-Ace R9200',
        weightGrams: 140,
        msrp: 450
      },
      {
        category: 'CHAINRING',
        manufacturer: 'Shimano',
        model: 'Dura-Ace R9200',
        weightGrams: 85,
        msrp: 180
      },
      {
        category: 'DERAILLEUR',
        manufacturer: 'Shimano',
        model: 'Dura-Ace R9200',
        weightGrams: 115,
        msrp: 350
      }
    ],
    tags: ['World Champion', 'Mud Clearance', 'Power Transfer'],
    likes: 1247,
    verifiedDate: '2024-01-15'
  },
  {
    id: '2',
    rider: 'Loic Bruni',
    team: 'Specialized Gravity',
    discipline: 'downhill',
    bike: 'Specialized Demo',
    year: 2024,
    verified: true,
    totalWeight: 15800,
    totalCost: 8500,
    imageUrl: 'https://example.com/bruni-bike.jpg',
    description: 'Bruni\'s World Cup winning downhill setup. Built for maximum control and durability in extreme conditions.',
    components: [
      {
        category: 'CASSETTE',
        manufacturer: 'SRAM',
        model: 'X01 DH',
        weightGrams: 280,
        msrp: 180
      },
      {
        category: 'CHAINRING',
        manufacturer: 'SRAM',
        model: 'X01 DH',
        weightGrams: 95,
        msrp: 120
      }
    ],
    tags: ['World Cup Winner', 'Downhill', 'Durability'],
    likes: 892,
    verifiedDate: '2024-01-10'
  },
  {
    id: '3',
    rider: 'Tadej Pogačar',
    team: 'UAE Team Emirates',
    discipline: 'road',
    bike: 'Colnago V4Rs',
    year: 2024,
    verified: true,
    totalWeight: 6800,
    totalCost: 15000,
    imageUrl: 'https://example.com/pogacar-bike.jpg',
    description: 'Pogačar\'s Tour de France setup. Optimized for climbing and time trials with perfect weight distribution.',
    components: [
      {
        category: 'CASSETTE',
        manufacturer: 'Shimano',
        model: 'Dura-Ace R9200',
        weightGrams: 140,
        msrp: 450
      },
      {
        category: 'CHAINRING',
        manufacturer: 'Shimano',
        model: 'Dura-Ace R9200',
        weightGrams: 85,
        msrp: 180
      }
    ],
    tags: ['Tour de France', 'Climbing', 'Aero'],
    likes: 2156,
    verifiedDate: '2024-01-20'
  }
]

export default function ProBuildsPage() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'likes' | 'weight' | 'cost' | 'date'>('likes')

  const disciplines = [
    { id: 'all', name: 'All Disciplines', icon: '🚴' },
    { id: 'road', name: 'Road', icon: '🛣️' },
    { id: 'mtb', name: 'Mountain Bike', icon: '🌲' },
    { id: 'gravel', name: 'Gravel', icon: '🪨' },
    { id: 'cyclocross', name: 'Cyclocross', icon: '🏃' },
    { id: 'enduro', name: 'Enduro', icon: '⛰️' },
    { id: 'downhill', name: 'Downhill', icon: '🎢' }
  ]

  const filteredBuilds = sampleProBuilds
    .filter(build => selectedDiscipline === 'all' || build.discipline === selectedDiscipline)
    .filter(build => 
      build.rider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      build.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      build.bike.toLowerCase().includes(searchTerm.toLowerCase()) ||
      build.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes
        case 'weight':
          return a.totalWeight - b.totalWeight
        case 'cost':
          return b.totalCost - a.totalCost
        case 'date':
          return new Date(b.verifiedDate).getTime() - new Date(a.verifiedDate).getTime()
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pro Builds
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what the pros are riding. Get inspired by verified setups from top cyclists and teams around the world.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search riders, teams, bikes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Discipline Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {disciplines.map(discipline => (
                <button
                  key={discipline.id}
                  onClick={() => setSelectedDiscipline(discipline.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedDiscipline === discipline.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{discipline.icon}</span>
                  <span>{discipline.name}</span>
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="likes">Most Popular</option>
              <option value="weight">Lightest</option>
              <option value="cost">Most Expensive</option>
              <option value="date">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Pro Builds Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBuilds.map(build => (
            <div key={build.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bike className="w-16 h-16 text-gray-400" />
                </div>
                {build.verified && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Trophy className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{build.rider}</h3>
                  <p className="text-sm text-gray-600 mb-2">{build.team}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{build.bike}</span>
                    <span className="text-sm text-gray-500">{build.year}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-lg font-bold text-gray-900">{(build.totalWeight / 1000).toFixed(1)}kg</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Cost</p>
                    <p className="text-lg font-bold text-gray-900">${(build.totalCost / 1000).toFixed(1)}k</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {build.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4 mr-1" />
                      <span className="text-sm">{build.likes}</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                      <Share2 className="w-4 h-4 mr-1" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  <button className="btn-primary text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Want to see your build here?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Submit your verified pro setup and get featured alongside the world's best riders.
          </p>
          <button className="btn-primary">
            Submit Pro Build
          </button>
        </div>
      </div>
    </div>
  )
} 