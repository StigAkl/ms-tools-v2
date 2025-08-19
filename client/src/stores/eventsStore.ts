import { Player } from "@/models/types";
import { create } from "zustand";

type State = {
  players: Player[];
  loaded: boolean;
  error: boolean;
  loadOnce: () => Promise<void>;
};

export const useEventsStore = create<State>((set, get) => ({
  players: [],
  loaded: false,
  error: false,

  loadOnce: async () => {
    if (get().loaded) return;

    try {
      const response = await fetch("http://localhost:3000/api/v1/events");
      const data = await response.json();
      set({ players: data, loaded: true });
    } catch (error) {
      console.error("Failed to load players:", error);
      set({ loaded: true, error: true });
    }
  },
}));
