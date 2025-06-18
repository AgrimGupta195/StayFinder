import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ fullName, email, password, confirmPassword, role }) => {
		set({ loading: true });
		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}
		try {
			await axios.post("/users/signup", { fullName, email, password, role });
			await get().checkAuth(); // Ensure user state is updated from backend
			set({ loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	login: async (email, password) => {
		set({ loading: true });
		try {
			const res = await axios.post("/users/login", { email, password });
			await get().checkAuth();
			set({ loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	logout: async () => {
		try {
			await axios.post("/users/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},
	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/users/check");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},
}));