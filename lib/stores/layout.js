import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useLayoutStore = create(
  subscribeWithSelector((set) => ({
    rooms: [],
    furniture: [],
    selectedRoomId: null,
    selectedFurnitureId: null,
    zoom: 1,
    panX: 0,
    panY: 0,

    addRoom: (room) =>
      set((state) => ({
        rooms: [...state.rooms, { ...room, id: crypto.randomUUID() }],
      })),

    updateRoom: (id, updates) =>
      set((state) => ({
        rooms: state.rooms.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      })),

    deleteRoom: (id) =>
      set((state) => ({
        rooms: state.rooms.filter((r) => r.id !== id),
        furniture: state.furniture.filter((f) => f.roomId !== id),
      })),

    selectRoom: (id) => set({ selectedRoomId: id }),

    addFurniture: (furniture) =>
      set((state) => ({
        furniture: [...state.furniture, { ...furniture, id: crypto.randomUUID() }],
      })),

    updateFurniture: (id, updates) =>
      set((state) => ({
        furniture: state.furniture.map((f) => (f.id === id ? { ...f, ...updates } : f)),
      })),

    deleteFurniture: (id) =>
      set((state) => ({
        furniture: state.furniture.filter((f) => f.id !== id),
      })),

    selectFurniture: (id) => set({ selectedFurnitureId: id }),

    setZoom: (zoom) => set({ zoom }),

    setPan: (x, y) => set({ panX: x, panY: y }),

    reset: () =>
      set({
        rooms: [],
        furniture: [],
        selectedRoomId: null,
        selectedFurnitureId: null,
        zoom: 1,
        panX: 0,
        panY: 0,
      }),
  }))
);
