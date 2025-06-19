import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Bed, Bath, Star, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import useBookingStore from '../stores/useBookingStore';
import { useNavigate } from 'react-router-dom';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { bookingList:bookings, loading, fetchBookings, cancelBooking } = useBookingStore();
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled


  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-emerald-400" size={20} />;
      case 'completed':
        return <CheckCircle className="text-blue-400" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-400" size={20} />;
      default:
        return <Clock className="text-yellow-400" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'completed':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'cancelled':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();
    switch (filter) {
      case 'upcoming':
        return bookings.filter(booking =>
          new Date(booking.checkIn) > now && booking.status === 'confirmed'
        );
      case 'past':
        return bookings.filter(booking =>
          new Date(booking.checkOut) < now || booking.status === 'completed'
        );
      case 'cancelled':
        return bookings.filter(booking => booking.status === 'cancelled');
      default:
        return bookings;
    }
  };

  if (loading) {
    return (
      <div className='relative min-h-screen text-white overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 opacity-80' />
        <div className='absolute inset-0 bg-black opacity-50' />
        <div className='relative z-10 flex items-center justify-center min-h-screen'>
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-emerald-400 text-lg">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
      {/* Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 opacity-80' />
      <div className='absolute inset-0 bg-black opacity-50' />

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors mr-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </button>
            <h1 className="text-3xl font-bold text-emerald-400">My Bookings</h1>
          </div>
          <div className="text-right">
            <p className="text-gray-300">Total Bookings</p>
            <p className="text-2xl font-bold text-emerald-400">{bookings.length}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 bg-opacity-50 rounded-lg p-1">
          {[{
            key: 'all',
            label: 'All Bookings'
          },
          {
            key: 'upcoming',
            label: 'Upcoming'
          },
          {
            key: 'past',
            label: 'Past'
          },
          {
            key: 'cancelled',
            label: 'Cancelled'
          }]
          .map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mb-4">
              <Calendar className="text-gray-400" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No bookings found</h2>
            <p className="text-gray-500 mb-6">
              {filter === 'all'
                ? "You haven't made any bookings yet."
                : `No ${filter} bookings found.`}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Explore Properties
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg border border-emerald-500/30 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Property Image */}
                  <div className="lg:w-1/3">
                    <div className="relative h-64 lg:h-full">
                      <img
                        src={booking.listing?.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                        alt={booking.listing?.title || "Property"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm flex items-center">
                        <Star size={14} className="text-yellow-400 mr-1" />
                        <span>{booking.property?.rating || "N/A"}</span>
                      </div>
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <span className="ml-2 capitalize">{booking.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="lg:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-emerald-400 mb-2">
                          {booking.property?.title}
                        </h3>
                        <div className="flex items-center text-gray-300 mb-2">
                          <MapPin size={16} className="mr-2 text-emerald-400" />
                          <span>{booking.property?.location?.City}, {booking.property?.location?.State}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Users size={16} className="mr-1 text-emerald-400" />
                            <span>{booking.property?.maxGuests} guests</span>
                          </div>
                          <div className="flex items-center">
                            <Bed size={16} className="mr-1 text-emerald-400" />
                            <span>{booking.property?.numBedrooms} bed</span>
                          </div>
                          <div className="flex items-center">
                            <Bath size={16} className="mr-1 text-emerald-400" />
                            <span>{booking.property?.numBathrooms} bath</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Booking ID</p>
                        <p className="font-mono text-emerald-400">{booking._id}</p>
                      </div>
                    </div>

                    {/* Booking Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Calendar className="text-emerald-400 mr-2" size={16} />
                          <span className="text-sm text-emerald-400 font-medium">Check-in</span>
                        </div>
                        <p className="text-white font-semibold">
                          {new Date(booking.checkIn).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Calendar className="text-emerald-400 mr-2" size={16} />
                          <span className="text-sm text-emerald-400 font-medium">Check-out</span>
                        </div>
                        <p className="text-white font-semibold">
                          {new Date(booking.checkOut).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Users className="text-emerald-400 mr-2" size={16} />
                          <span className="text-sm text-emerald-400 font-medium">Guests</span>
                        </div>
                        <p className="text-white font-semibold">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {/* Total and Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="mb-4 sm:mb-0">
                        <p className="text-sm text-gray-400">Total ({booking.totalNights} nights)</p>
                        <p className="text-2xl font-bold text-emerald-400">${booking.totalPrice}</p>
                        <p className="text-xs text-gray-500">
                          Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/property/${booking.listing?._id}`)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          View Property
                        </button>
                        {booking.status === 'confirmed' && new Date(booking.checkIn) > new Date() && (
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;