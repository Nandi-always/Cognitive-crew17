import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface Room {
  id: string;
  name: string;
  type: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'balcony' | 'study';
  width: number;
  height: number;
  x: number;
  y: number;
  color?: string;
}

export interface Furniture {
  id: string;
  name: string;
  type: string;
  width: number;
  height: number;
  x: number;
  y: number;
  roomId: string;
  rotation: number;
}

export interface LayoutState {
  rooms: Room[];
  furniture: Furniture[];
  selectedRoomId: string | null;
  selectedFurnitureId: string | null;
  zoom: number;
  panX: number;
  panY: number;

  // Actions
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  selectRoom: (id: string | null) => void;

  addFurniture: (furniture: Omit<Furniture, 'id'>) => void;
  updateFurniture: (id: string, furniture: Partial<Furniture>) => void;
  deleteFurniture: (id: string) => void;
  selectFurniture: (id: string | null) => void;

  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  reset: () => void;
}

export const useLayoutStore = create<LayoutState>()(
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
        furniture: state.furniture.map((f) =>
          f.id === id ? { ...f, ...updates } : f
        ),
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
