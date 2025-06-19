import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';


const useBookingStore = create((set, get) => ({
  bookingList: [],
  loading: false,
  error: null,
  fetchBookings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/bookings/me');
      set({ bookingList: response.data.bookings || response.data });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch bookings');
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  cancelBooking: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/bookings/${bookingId}`);
      toast.success('Booking cancelled successfully');
      await get().fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  }
}));

export default useBookingStore;
