import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

const useListingStore = create((set, get) => ({
  listings: [],
  loading: false,
  error: null,
  fetchListings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/listings/');
      set({ listings: response.data });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch listings');
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // Get a single listing by ID
  getListingById: async (id) => {
    try {
      const response = await axios.get(`/listings/${id}`);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch listing');
      return null;
    }
  },

  // Create listing
  createListing: async (listingData) => {
    try {
      await axios.post('/listings/', listingData);
      toast.success('Listing created successfully');
      await get().fetchListings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    }
  },

  // Update listing
  updateListing: async (id, updatedData) => {
    try {
      await axios.put(`/listings/${id}`, updatedData);
      toast.success('Listing updated successfully');
      await get().fetchListings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update listing');
    }
  },

  // Delete listing
  deleteListing: async (id) => {
    try {
      await axios.delete(`/listings/${id}`);
      toast.success('Listing deleted successfully');
      await get().fetchListings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete listing');
    }
  },
}));

export default useListingStore;
