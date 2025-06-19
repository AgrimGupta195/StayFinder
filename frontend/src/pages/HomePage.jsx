import React, { useState, useEffect } from 'react';
import { Search, MapPin, Home, Filter, Star, Users, Bed, Bath, ArrowUpDown } from 'lucide-react';
import useListingStore from '../stores/useListingStore';
import { useNavigate } from 'react-router-dom';

const propertyTypes = [
  "Apartment", "House", "Villa", "Cabin", "Condo", "Loft", "Studio", "Townhouse", "Cottage", "Mansion"
];

const HomePage = () => {
  const { listings, fetchListings, loading } = useListingStore();
  const navigate = useNavigate();
  const [filteredListings, setFilteredListings] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    propertyType: '',
    priceSort: '' // 'low-to-high' or 'high-to-low'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    filterListings();
  }, [filters, listings]);

  const filterListings = () => {
    let filtered = (listings || []).filter(listing => !listing.occupied);

    if (filters.city) {
      filtered = filtered.filter(listing =>
        (listing.location?.City || '').toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.state) {
      filtered = filtered.filter(listing =>
        (listing.location?.State || '').toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(listing => listing.propertyType === filters.propertyType);
    }

    // Apply price sorting
    if (filters.priceSort === 'low-to-high') {
      filtered = filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (filters.priceSort === 'high-to-low') {
      filtered = filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
    }

    setFilteredListings(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      state: '',
      propertyType: '',
      priceSort: ''
    });
  };

  const PropertyCard = ({ listing }) => (
    <div 
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg border border-emerald-500/30 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:border-emerald-500/50 group cursor-pointer"
      onClick={() => navigate(`/property/${listing._id}`)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={listing.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"} 
          alt={listing.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          ${listing.pricePerNight}/night
        </div>
        <div className="absolute top-4 left-4 flex items-center bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
          <Star size={14} className="text-yellow-400 mr-1" />
          <span>4.8</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 text-emerald-400 group-hover:text-emerald-300 transition-colors">
          {listing.title}
        </h3>
        <div className="flex items-center text-gray-300 mb-3">
          <MapPin size={16} className="mr-2 text-emerald-400" />
          <span className="text-sm">{listing.location?.City || "Unknown"}, {listing.location?.State || "Unknown"}</span>
        </div>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{listing.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <Users size={16} className="mr-1 text-emerald-400" />
            <span>{listing.maxGuests} guests</span>
          </div>
          <div className="flex items-center">
            <Bed size={16} className="mr-1 text-emerald-400" />
            <span>{listing.numBedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1 text-emerald-400" />
            <span>{listing.numBathrooms} bath</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-emerald-400">${listing.pricePerNight}</span>
            <span className="text-xs text-gray-400">per night</span>
          </div>
          <button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/property/${listing._id}`);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
      {/* Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 opacity-80' />
      <div className='absolute inset-0 bg-black opacity-50' />
      
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className='text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
            Find Your Perfect Stay
          </h1>
          <p className='text-xl text-gray-300 mb-8'>
            Discover unique places to stay around the world
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg border border-emerald-500/30 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-emerald-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by city..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-emerald-400" size={20} />
                  <input
                    type="text"
                    placeholder="State..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-3 text-emerald-400" size={20} />
                  <select
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                    value={filters.priceSort}
                    onChange={(e) => handleFilterChange('priceSort', e.target.value)}
                  >
                    <option value="">Sort by Price</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  showFilters 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'
                }`}
              >
                <Filter size={20} />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters - Toggleable */}
        {showFilters && (
          <div className="max-w-6xl mx-auto mb-8 animate-in slide-in-from-top duration-300">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg border border-emerald-500/30 p-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">
                  {filteredListings.length} {filteredListings.length === 1 ? 'property' : 'properties'} found
                </span>
                <button
                  onClick={clearFilters}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Property Types Quick Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-emerald-400 mb-8">
            Browse by Property Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {propertyTypes.slice(0, 10).map(type => (
              <button
                key={type}
                onClick={() => handleFilterChange('propertyType', type)}
                className={`p-4 bg-gray-800 bg-opacity-50 backdrop-blur-md border rounded-lg transition-all duration-300 text-center group ${
                  filters.propertyType === type 
                    ? 'border-emerald-500 bg-emerald-500/20' 
                    : 'border-emerald-500/30 hover:border-emerald-500/50'
                } hover:shadow-lg hover:shadow-emerald-500/25`}
              >
                <Home size={24} className="mx-auto mb-2 text-emerald-400 group-hover:text-emerald-300" />
                <span className="text-xs font-medium text-gray-300 group-hover:text-emerald-300">
                  {type}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-emerald-400">
              {filteredListings.length} {filteredListings.length === 1 ? 'Property' : 'Properties'} Available
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-16">
              <Home size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No properties found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map(listing => (
                <PropertyCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;