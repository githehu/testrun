import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: "https://fakestoreapi.com",
  headers: { "Content-Type": "application/json" },
});

const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  // Day 1: READ (GET)
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/users");
      set({ users: data, loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to fetch users", loading: false });
    }
  },

  fetchUserById: async (id) => {
    // Check cache first
    const cached = get().users.find((u) => String(u.id) === String(id));
    if (cached) return cached;

    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/users/${id}`);
      // merge into users list without duplicates
      const existing = get().users;
      const merged = [...existing.filter((u) => u.id !== data.id), data];
      set({ users: merged, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message || "Failed to fetch user", loading: false });
      return null;
    }
  },

  // Day 2: CREATE (POST)
  createUser: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/users", payload);
      set((state) => ({ users: [...state.users, data], loading: false }));
      return data;
    } catch (err) {
      set({ error: err.message || "Failed to create user", loading: false });
      return null;
    }
  },

  // Day 2: UPDATE (PUT)
  updateUser: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.put(`/users/${id}`, payload);
      set((state) => ({
        users: state.users.map((u) => (u.id === data.id ? data : u)),
        loading: false,
      }));
      return data;
    } catch (err) {
      set({ error: err.message || "Failed to update user", loading: false });
      return null;
    }
  },

  // Day 3: DELETE
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/users/${id}`);
      set((state) => ({
        users: state.users.filter((u) => String(u.id) !== String(id)),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message || "Failed to delete user", loading: false });
      return false;
    }
  },

  // Helper to clear errors
  clearError: () => set({ error: null }),
}));

export default useUserStore;


