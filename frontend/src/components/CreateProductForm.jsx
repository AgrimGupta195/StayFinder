import { useState } from "react";
import { PlusCircle, Upload, Loader, X, MapPin, Calendar, Users, Home } from "lucide-react";
import useListingStore from "../stores/useListingStore"; // <-- import the store

const propertyTypes = ["apartment", "house", "condo", "villa", "cabin", "cottage", "loft", "studio"];
const amenities = ["wifi", "parking", "pool", "gym", "kitchen", "laundry", "pet-friendly", "air-conditioning", "heating", "tv", "balcony", "garden"];

const CreateProductForm = () => {
    const [newListing, setNewListing] = useState({
        title: "",
        description: "",
        pricePerNight: "",
        propertyType: "",
        maxGuests: "",
        bedrooms: "",
        bathrooms: "",
        images: [],
        location: {
            address: "",
            city: "",
            state: "",
            country: "",
            zipCode: ""
        },
        availableDates: [
            {
                startDate: "",
                endDate: ""
            }
        ],
        amenities: []
    });

    const [loading, setLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const { createListing } = useListingStore(); // <-- get createListing from store

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitMessage("");

        // Validate required fields
        const requiredFields = [
            newListing.title,
            newListing.description,
            newListing.pricePerNight,
            newListing.propertyType,
            newListing.maxGuests,
            newListing.bedrooms,
            newListing.bathrooms,
            newListing.location.address,
            newListing.location.city,
            newListing.location.state,
            newListing.location.country,
            newListing.location.zipCode
        ];

        const hasEmptyDates = newListing.availableDates.some(date => !date.startDate || !date.endDate);
        
        if (requiredFields.some(field => !field) || hasEmptyDates) {
            setSubmitMessage("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        // Prepare images as base64 strings
        const images = newListing.images.map(img => img.url);

        // Map location fields to backend model
        const location = {
            Address: newListing.location.address,
            City: newListing.location.city,
            State: newListing.location.state,
            Country: newListing.location.country,
            ZipCode: newListing.location.zipCode,
            StreetAddress: newListing.location.address // or split if you want
        };

        // Flatten availableDates to an array of dates (all days between start and end)
        let availableDates = [];
        newListing.availableDates.forEach(range => {
            if (range.startDate && range.endDate) {
                const start = new Date(range.startDate);
                const end = new Date(range.endDate);
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    availableDates.push(new Date(d).toISOString());
                }
            }
        });

        // Capitalize propertyType
        const propertyType = newListing.propertyType.charAt(0).toUpperCase() + newListing.propertyType.slice(1);

        // Prepare payload for backend
        const payload = {
            title: newListing.title,
            description: newListing.description,
            pricePerNight: Number(newListing.pricePerNight),
            propertyType,
            maxGuests: Number(newListing.maxGuests),
            numBedrooms: Number(newListing.bedrooms),
            numBathrooms: Number(newListing.bathrooms),
            images,
            location,
            availableDates,
            amenities: newListing.amenities
        };

        try {
            await createListing(payload); // <-- call store action
            setSubmitMessage("Listing created successfully!");
            // Reset form
            setNewListing({
                title: "",
                description: "",
                pricePerNight: "",
                propertyType: "",
                maxGuests: "",
                bedrooms: "",
                bathrooms: "",
                images: [],
                location: {
                    address: "",
                    city: "",
                    state: "",
                    country: "",
                    zipCode: ""
                },
                availableDates: [
                    {
                        startDate: "",
                        endDate: ""
                    }
                ],
                amenities: []
            });
        } catch (error) {
            setSubmitMessage("Error creating listing. Please try again.");
        } finally {
            setLoading(false);
        }
    };

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		
		if (files.length > 0) {
			const imagePromises = files.map(file => {
				return new Promise((resolve) => {
					const reader = new FileReader();
					reader.onloadend = () => {
						resolve({
							url: reader.result,
							filename: file.name,
							id: Date.now() + Math.random(),
							isPrimary: newListing.images.length === 0 // First image is primary by default
						});
					};
					reader.readAsDataURL(file);
				});
			});

			Promise.all(imagePromises).then(newImages => {
				setNewListing(prev => ({
					...prev,
					images: [...prev.images, ...newImages]
				}));
			});
		}
	};

	const removeImage = (imageId) => {
		setNewListing(prev => {
			const updatedImages = prev.images.filter(img => img.id !== imageId);
			// If we removed the primary image, make the first remaining image primary
			if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
				updatedImages[0].isPrimary = true;
			}
			return {
				...prev,
				images: updatedImages
			};
		});
	};

	const setPrimaryImage = (imageId) => {
		setNewListing(prev => ({
			...prev,
			images: prev.images.map(img => ({
				...img,
				isPrimary: img.id === imageId
			}))
		}));
	};

	const handleLocationChange = (field, value) => {
		setNewListing(prev => ({
			...prev,
			location: {
				...prev.location,
				[field]: value
			}
		}));
	};

	const handleDateChange = (index, field, value) => {
		setNewListing(prev => ({
			...prev,
			availableDates: prev.availableDates.map((date, i) => 
				i === index ? { ...date, [field]: value } : date
			)
		}));
	};

	const addDateRange = () => {
		setNewListing(prev => ({
			...prev,
			availableDates: [...prev.availableDates, { startDate: "", endDate: "" }]
		}));
	};

	const removeDateRange = (index) => {
		if (newListing.availableDates.length > 1) {
			setNewListing(prev => ({
				...prev,
				availableDates: prev.availableDates.filter((_, i) => i !== index)
			}));
		}
	};

	const handleAmenityChange = (amenity) => {
		setNewListing(prev => ({
			...prev,
			amenities: prev.amenities.includes(amenity)
				? prev.amenities.filter(a => a !== amenity)
				: [...prev.amenities, amenity]
		}));
	};

	return (
		<div className="min-h-screen bg-gray-900 py-8 px-4">
			<div className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-4xl mx-auto transform transition-all duration-300 hover:shadow-xl">
				<h2 className="text-2xl font-semibold mb-6 text-emerald-300">Create New Listing</h2>

				{submitMessage && (
					<div className={`mb-4 p-3 rounded-md ${
						submitMessage.includes('Error') 
							? 'bg-red-100 border border-red-400 text-red-700' 
							: 'bg-green-100 border border-green-400 text-green-700'
					}`}>
						{submitMessage}
					</div>
				)}

				<div className="space-y-6">
					{/* Basic Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label htmlFor="title" className="block text-sm font-medium text-gray-300">
								Listing Title
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={newListing.title}
								onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
								className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
								placeholder="Beautiful downtown apartment"
								required
							/>
						</div>

						<div>
							<label htmlFor="pricePerNight" className="block text-sm font-medium text-gray-300">
								Price per Night ($)
							</label>
							<input
								type="number"
								id="pricePerNight"
								name="pricePerNight"
								value={newListing.pricePerNight}
								onChange={(e) => setNewListing({ ...newListing, pricePerNight: e.target.value })}
								step="0.01"
								className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
								required
							/>
						</div>
					</div>

					<div>
						<label htmlFor="description" className="block text-sm font-medium text-gray-300">
							Description
						</label>
						<textarea
							id="description"
							name="description"
							value={newListing.description}
							onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
							rows="4"
							className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
							placeholder="Describe your property..."
							required
						/>
					</div>

					{/* Property Details */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div>
							<label htmlFor="propertyType" className="block text-sm font-medium text-gray-300">
								<Home className="inline h-4 w-4 mr-1" />
								Property Type
							</label>
							<select
								id="propertyType"
								name="propertyType"
								value={newListing.propertyType}
								onChange={(e) => setNewListing({ ...newListing, propertyType: e.target.value })}
								className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
								required
							>
								<option value="">Select type</option>
								{propertyTypes.map((type) => (
									<option key={type} value={type}>
										{type.charAt(0).toUpperCase() + type.slice(1)}
									</option>
								))}
							</select>
						</div>

						<div>
							<label htmlFor="maxGuests" className="block text-sm font-medium text-gray-300">
								<Users className="inline h-4 w-4 mr-1" />
								Max Guests
							</label>
							<input
								type="number"
								id="maxGuests"
								name="maxGuests"
								value={newListing.maxGuests}
								onChange={(e) => setNewListing({ ...newListing, maxGuests: e.target.value })}
								min="1"
								className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
								required
							/>
						</div>

						<div>
							<label htmlFor="bedrooms" className="block text-sm font-medium text-gray-300">
								Bedrooms
							</label>
							<input
								type="number"
								id="bedrooms"
								name="bedrooms"
								value={newListing.bedrooms}
								onChange={(e) => setNewListing({ ...newListing, bedrooms: e.target.value })}
								min="0"
								className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
								required
							/>
						</div>

						<div>
							<label htmlFor="bathrooms" className="block text-sm font-medium text-gray-300">
								Bathrooms
							</label>
							<input
								type="number"
								id="bathrooms"
								name="bathrooms"
								value={newListing.bathrooms}
								onChange={(e) => setNewListing({ ...newListing, bathrooms: e.target.value })}
								min="0"
								step="0.5"
								className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
								required
							/>
						</div>
					</div>

					{/* Location */}
					<div>
						<h3 className="text-lg font-medium text-gray-300 mb-3">
							<MapPin className="inline h-5 w-5 mr-2" />
							Location
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="md:col-span-2">
								<input
									type="text"
									placeholder="Street Address"
									value={newListing.location.address}
									onChange={(e) => handleLocationChange('address', e.target.value)}
									className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
									required
								/>
							</div>
							<div>
								<input
									type="text"
									placeholder="City"
									value={newListing.location.city}
									onChange={(e) => handleLocationChange('city', e.target.value)}
									className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
									required
								/>
							</div>
							<div>
								<input
									type="text"
									placeholder="State/Province"
									value={newListing.location.state}
									onChange={(e) => handleLocationChange('state', e.target.value)}
									className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
									required
								/>
							</div>
							<div>
								<input
									type="text"
									placeholder="Country"
									value={newListing.location.country}
									onChange={(e) => handleLocationChange('country', e.target.value)}
									className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
									required
								/>
							</div>
							<div>
								<input
									type="text"
									placeholder="ZIP/Postal Code"
									value={newListing.location.zipCode}
									onChange={(e) => handleLocationChange('zipCode', e.target.value)}
									className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
									required
								/>
							</div>
						</div>
					</div>

					{/* Available Dates */}
					<div>
						<h3 className="text-lg font-medium text-gray-300 mb-3">
							<Calendar className="inline h-5 w-5 mr-2" />
							Available Dates
						</h3>
						{newListing.availableDates.map((dateRange, index) => (
							<div key={index} className="flex items-center space-x-4 mb-3">
								<input
									type="date"
									value={dateRange.startDate}
									onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
									className="bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
									required
								/>
								<span className="text-gray-400">to</span>
								<input
									type="date"
									value={dateRange.endDate}
									onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
									className="bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
									required
								/>
								{newListing.availableDates.length > 1 && (
									<button
										type="button"
										onClick={() => removeDateRange(index)}
										className="text-red-400 hover:text-red-300 transition-colors"
									>
										<X className="h-5 w-5" />
									</button>
								)}
							</div>
						))}
						<button
							type="button"
							onClick={addDateRange}
							className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
						>
							+ Add another date range
						</button>
					</div>

					{/* Amenities */}
					<div>
						<h3 className="text-lg font-medium text-gray-300 mb-3">Amenities</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							{amenities.map((amenity) => (
								<label key={amenity} className="flex items-center text-gray-300 hover:text-white transition-colors cursor-pointer">
									<input
										type="checkbox"
										checked={newListing.amenities.includes(amenity)}
										onChange={() => handleAmenityChange(amenity)}
										className="mr-2 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500"
									/>
									{amenity.charAt(0).toUpperCase() + amenity.slice(1).replace('-', ' ')}
								</label>
							))}
						</div>
					</div>

					{/* Images */}
					<div>
						<h3 className="text-lg font-medium text-gray-300 mb-3">Property Images</h3>
						<div className="flex items-center mb-4">
							<input 
								type="file" 
								id="images" 
								className="sr-only" 
								accept="image/*" 
								multiple 
								onChange={handleImageChange} 
							/>
							<label
								htmlFor="images"
								className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
							>
								<Upload className="h-5 w-5 inline-block mr-2" />
								Upload Images
							</label>
							{newListing.images.length > 0 && (
								<span className="ml-3 text-sm text-gray-400">
									{newListing.images.length} image{newListing.images.length !== 1 ? 's' : ''} uploaded
								</span>
							)}
						</div>

						{newListing.images.length > 0 && (
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{newListing.images.map((image) => (
									<div key={image.id} className="relative group">
										<div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
											<img
												src={image.url}
												alt={`Property ${image.filename}`}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
											<button
												type="button"
												onClick={() => setPrimaryImage(image.id)}
												className={`text-xs px-2 py-1 rounded transition-colors ${
													image.isPrimary 
														? 'bg-emerald-500 text-white' 
														: 'bg-gray-600 text-gray-300 hover:bg-gray-500'
												}`}
											>
												{image.isPrimary ? 'Primary' : 'Set Primary'}
											</button>
											<button
												type="button"
												onClick={() => removeImage(image.id)}
												className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
										<div className="mt-1 text-xs text-gray-400 truncate">
											{image.filename}
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					<button
						type="button"
						onClick={handleSubmit}
						className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
						disabled={loading}
					>
						{loading ? (
							<>
								<Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
								Creating Listing...
							</>
						) : (
							<>
								<PlusCircle className="mr-2 h-5 w-5" />
								Create Listing
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateProductForm;