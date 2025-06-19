import { useState, useEffect } from "react";
import { Edit, Trash2, Eye, MapPin, Users, Home, Calendar, DollarSign, X, Check, Loader } from "lucide-react";
import useListingStore from "../stores/useListingStore";

const propertyTypes = ["apartment", "house", "condo", "villa", "cabin", "cottage", "loft", "studio"];
const amenities = ["wifi", "parking", "pool", "gym", "kitchen", "laundry", "pet-friendly", "air-conditioning", "heating", "tv", "balcony", "garden"];

const HostListingsManager = () => {
    const { hostListings:listings, fetchHostListings, updateListing, deleteListing } = useListingStore();
    const [loading, setLoading] = useState(true);
    const [editingListing, setEditingListing] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadHostListings();
        // eslint-disable-next-line
    }, []);

    const loadHostListings = async () => {
        try {
            setLoading(true);
            await fetchHostListings();
        } catch (error) {
            setMessage("Error loading listings");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (listing) => {
        setEditingListing(listing._id); // FIX: use _id
        setEditFormData({
            title: listing.title,
            description: listing.description,
            pricePerNight: listing.pricePerNight,
            propertyType: listing.propertyType?.toLowerCase() || "",
            maxGuests: listing.maxGuests,
            numBedrooms: listing.numBedrooms,
            numBathrooms: listing.numBathrooms,
            location: {
                address: listing.location?.Address || "",
                city: listing.location?.City || "",
                state: listing.location?.State || "",
                country: listing.location?.Country || "",
                zipCode: listing.location?.ZipCode || ""
            },
            amenities: listing.amenities || []
        });
    };

    const handleCancelEdit = () => {
        setEditingListing(null);
        setEditFormData({});
    };

    const handleSaveEdit = async () => {
        try {
            const payload = {
                ...editFormData,
                propertyType: editFormData.propertyType.charAt(0).toUpperCase() + editFormData.propertyType.slice(1),
                location: {
                    Address: editFormData.location.address,
                    City: editFormData.location.city,
                    State: editFormData.location.state,
                    Country: editFormData.location.country,
                    ZipCode: editFormData.location.zipCode,
                    StreetAddress: editFormData.location.address
                }
            };

            await updateListing(editingListing, payload);
            setEditingListing(null);
            setEditFormData({});
            setMessage("Listing updated successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Error updating listing");
        }
    };

    const handleDelete = async (listingId) => {
        try {
            await deleteListing(listingId);
            setDeleteConfirm(null);
            setMessage("Listing deleted successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Error deleting listing");
        }
    };

    const handleAmenityChange = (amenity) => {
        setEditFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleLocationChange = (field, value) => {
        setEditFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [field]: value
            }
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center py-12">
                        <Loader className="h-8 w-8 animate-spin text-emerald-500" />
                        <span className="ml-2 text-gray-300">Loading your listings...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-emerald-300 mb-2">Your Listed Properties</h1>
                    <p className="text-gray-400">Manage your property listings</p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-md ${
                        message.includes('Error') 
                            ? 'bg-red-900 border border-red-700 text-red-200' 
                            : 'bg-green-900 border border-green-700 text-green-200'
                    }`}>
                        {message}
                    </div>
                )}

                {listings.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-8 text-center">
                        <Home className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-300 mb-2">No listings found</h3>
                        <p className="text-gray-400">You haven't created any listings yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {listings.map((listing) => (
                            <div key={listing._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                {/* Image Section */}
                                <div className="relative h-48 bg-gray-700">
                                    {listing.images && listing.images.length > 0 ? (
                                        <img
                                            src={listing.images[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Home className="h-16 w-16 text-gray-600" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                                        ${listing.pricePerNight}/night
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    {editingListing === listing._id ? (
                                        /* Edit Form */
                                        <div className="space-y-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={editFormData.title}
                                                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="Title"
                                                />
                                            </div>
                                            <div>
                                                <textarea
                                                    value={editFormData.description}
                                                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    rows="3"
                                                    placeholder="Description"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="number"
                                                    value={editFormData.pricePerNight}
                                                    onChange={(e) => setEditFormData({...editFormData, pricePerNight: Number(e.target.value)})}
                                                    className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="Price per night"
                                                />
                                                <select
                                                    value={editFormData.propertyType}
                                                    onChange={(e) => setEditFormData({...editFormData, propertyType: e.target.value})}
                                                    className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                >
                                                    {propertyTypes.map((type) => (
                                                        <option key={type} value={type}>
                                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <input
                                                    type="number"
                                                    value={editFormData.maxGuests}
                                                    onChange={(e) => setEditFormData({...editFormData, maxGuests: Number(e.target.value)})}
                                                    className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="Max guests"
                                                />
                                                <input
                                                    type="number"
                                                    value={editFormData.numBedrooms}
                                                    onChange={(e) => setEditFormData({...editFormData, numBedrooms: Number(e.target.value)})}
                                                    className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="Bedrooms"
                                                />
                                                <input
                                                    type="number"
                                                    value={editFormData.numBathrooms}
                                                    onChange={(e) => setEditFormData({...editFormData, numBathrooms: Number(e.target.value)})}
                                                    className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="Bathrooms"
                                                    step="0.5"
                                                />
                                            </div>
                                            
                                            {/* Location Edit */}
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium text-gray-300">Location</h4>
                                                <input
                                                    type="text"
                                                    value={editFormData.location.address}
                                                    onChange={(e) => handleLocationChange('address', e.target.value)}
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="Address"
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="text"
                                                        value={editFormData.location.city}
                                                        onChange={(e) => handleLocationChange('city', e.target.value)}
                                                        className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                        placeholder="City"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editFormData.location.state}
                                                        onChange={(e) => handleLocationChange('state', e.target.value)}
                                                        className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                        placeholder="State"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="text"
                                                        value={editFormData.location.country}
                                                        onChange={(e) => handleLocationChange('country', e.target.value)}
                                                        className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                        placeholder="Country"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editFormData.location.zipCode}
                                                        onChange={(e) => handleLocationChange('zipCode', e.target.value)}
                                                        className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                        placeholder="ZIP Code"
                                                    />
                                                </div>
                                            </div>

                                            {/* Amenities Edit */}
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-300 mb-2">Amenities</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {amenities.map((amenity) => (
                                                        <label key={amenity} className="flex items-center text-sm text-gray-300">
                                                            <input
                                                                type="checkbox"
                                                                checked={editFormData.amenities.includes(amenity)}
                                                                onChange={() => handleAmenityChange(amenity)}
                                                                className="mr-2 rounded text-emerald-500 focus:ring-emerald-500"
                                                            />
                                                            {amenity.charAt(0).toUpperCase() + amenity.slice(1).replace('-', ' ')}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex space-x-3 pt-4">
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                                                >
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Display Mode */
                                        <>
                                            <div className="mb-4">
                                                <h3 className="text-xl font-semibold text-white mb-2">{listing.title}</h3>
                                                <p className="text-gray-300 text-sm line-clamp-2">{listing.description}</p>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center text-gray-300">
                                                    <Home className="h-4 w-4 mr-2 text-emerald-400" />
                                                    <span className="text-sm">{listing.propertyType}</span>
                                                </div>
                                                <div className="flex items-center text-gray-300">
                                                    <Users className="h-4 w-4 mr-2 text-emerald-400" />
                                                    <span className="text-sm">
                                                        {listing.maxGuests} guests • {listing.numBedrooms} beds • {listing.numBathrooms} baths
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-300">
                                                    <MapPin className="h-4 w-4 mr-2 text-emerald-400" />
                                                    <span className="text-sm">
                                                        {listing.location?.City}, {listing.location?.State}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-300">
                                                    <DollarSign className="h-4 w-4 mr-2 text-emerald-400" />
                                                    <span className="text-sm font-medium">${listing.pricePerNight} per night</span>
                                                </div>
                                            </div>

                                            {listing.amenities && listing.amenities.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-300 mb-2">Amenities</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {listing.amenities.slice(0, 4).map((amenity) => (
                                                            <span key={amenity} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                                                                {amenity.charAt(0).toUpperCase() + amenity.slice(1).replace('-', ' ')}
                                                            </span>
                                                        ))}
                                                        {listing.amenities.length > 4 && (
                                                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                                                                +{listing.amenities.length - 4} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleEdit(listing)}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(listing._id)}
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                            <h3 className="text-lg font-medium text-white mb-4">Confirm Delete</h3>
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to delete this listing? This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostListingsManager;