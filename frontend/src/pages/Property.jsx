import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Coffee, 
  Tv, 
  Wind, 
  Star,
  Calendar,
  DollarSign,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  X
} from 'lucide-react';
import useListingStore from '../stores/useListingStore';

const PropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, fetchListings, loading } = useListingStore();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!listings || listings.length === 0) {
      fetchListings();
    }
  }, [listings, fetchListings]);

  useEffect(() => {
    if (listings && listings.length > 0) {
      const foundProperty = listings.find(listing => listing._id === id);
      setProperty(foundProperty);
    }
  }, [id, listings]);

  const amenityIcons = {
    'WiFi': <Wifi size={20} />,
    'Parking': <Car size={20} />,
    'Kitchen': <Coffee size={20} />,
    'TV': <Tv size={20} />,
    'Air Conditioning': <Wind size={20} />,
  };

  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const timeDiff = end.getTime() - start.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const totalPrice = calculateNights() * (property?.pricePerNight || 0);

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `Check out this amazing property: ${property.title} in ${property.location?.City || "Unknown"}, ${property.location?.State || "Unknown"}`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowShareModal(false);
      }, 2000);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowShareModal(false);
      }, 2000);
    }
  };

  const shareToSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this amazing property: ${property.title}`);
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      alert('Check-out date must be after check-in date');
      return;
    }
    alert('Booking functionality would be implemented here!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Properties
        </button>

        {/* Property Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-emerald-400 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-300 mb-4">
                <MapPin size={20} className="mr-2 text-emerald-400" />
                <span>{property.location?.City || "Unknown"}, {property.location?.State || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 mr-1" />
                  <span>{property.rating || '4.8'} ({property.reviews || '124'} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-1 text-emerald-400" />
                  <span>{property.maxGuests} guests</span>
                </div>
                <div className="flex items-center">
                  <Bed size={16} className="mr-1 text-emerald-400" />
                  <span>{property.numBedrooms || property.bedrooms} bedroom{(property.numBedrooms || property.bedrooms) !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Bath size={16} className="mr-1 text-emerald-400" />
                  <span>{property.numBathrooms || property.bathrooms} bathroom{(property.numBathrooms || property.bathrooms) !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 bg-gray-800 bg-opacity-50 border border-emerald-500/30 rounded-lg hover:border-emerald-500/50 transition-colors ${
                  isFavorite ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button 
                onClick={handleShare}
                className="p-3 bg-gray-800 bg-opacity-50 border border-emerald-500/30 rounded-lg hover:border-emerald-500/50 transition-colors"
              >
                <Share2 size={20} className="text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative mb-4">
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
              <img
                src={property.images?.[currentImageIndex] || "https://via.placeholder.com/800x500?text=No+Image"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {property.images && property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </>
              )}
            </div>
          </div>
          {property.images && property.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {property.images.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index ? 'border-emerald-500' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${property.title} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg border border-emerald-500/30 p-6 mb-6">
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">About this place</h2>
              <p className="text-gray-300 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg border border-emerald-500/30 p-6 mb-6">
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-300">
                    <div className="text-emerald-400">
                      {amenityIcons[amenity] || <Coffee size={20} />}
                    </div>
                    <span>{amenity}</span>
                  </div>
                )) || (
                  <div className="col-span-full text-gray-400">No amenities listed</div>
                )}
              </div>
            </div>

            {/* Host Info (if available) */}
            {property.host && (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg border border-emerald-500/30 p-6">
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">Meet your host</h2>
                <div className="flex items-center gap-4">
                  <img
                    src={property.host.avatar || "https://via.placeholder.com/60x60?text=Host"}
                    alt={property.host.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-white">{property.host.name}</h4>
                    <p className="text-gray-300">Host since {property.host.joinedDate}</p>
                    {property.host.verified && (
                      <div className="flex items-center gap-1 text-emerald-400 mt-1">
                        <Check size={16} />
                        <span className="text-sm">Verified host</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg border border-emerald-500/30 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold text-emerald-400">${property.pricePerNight || property.price}</span>
                  <span className="text-gray-400 ml-2">/ night</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-300">{property.rating || '4.8'}</span>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-emerald-400 mb-1">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-400 mb-1">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-400 mb-1">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} guest{num !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Breakdown */}
              {checkIn && checkOut && calculateNights() > 0 && (
                <div className="space-y-2 mb-6 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                  <div className="flex justify-between text-gray-300">
                    <span>${property.pricePerNight || property.price} × {calculateNights()} nights</span>
                    <span>${(property.pricePerNight || property.price) * calculateNights()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Service fee</span>
                    <span>$25</span>
                  </div>
                  <hr className="border-gray-600" />
                  <div className="flex justify-between font-bold text-emerald-400">
                    <span>Total</span>
                    <span>${totalPrice + 25}</span>
                  </div>
                </div>
              )}

              <button 
                onClick={handleBooking}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105"
              >
                Reserve Now
              </button>
              
              <p className="text-xs text-gray-400 text-center mt-2">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Share this property</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 bg-transparent text-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(window.location.href)}
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  {copySuccess ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Facebook
                </button>
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  Twitter
                </button>
                <button
                  onClick={() => shareToSocial('linkedin')}
                  className="p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => shareToSocial('whatsapp')}
                  className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  WhatsApp
                </button>
              </div>

              {copySuccess && (
                <div className="text-center text-emerald-400 text-sm">
                  Link copied to clipboard!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPage;