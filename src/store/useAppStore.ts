import { create } from 'zustand';
import type { Defect, UserRole } from '../types';
import { MOCK_DEFECTS } from '../data/mockData';

interface AppState {
    defects: Defect[];
    selectedDefectId: string | null;
    userRole: UserRole;

    // Actions
    selectDefect: (id: string) => void;
    setUserRole: (role: UserRole) => void;
    getSelectedDefect: () => Defect | undefined;
}

export const useAppStore = create<AppState>((set, get) => ({
    defects: MOCK_DEFECTS,
    selectedDefectId: MOCK_DEFECTS[0]?.id || null, // Default to first defect
    userRole: 'EQUIPMENT_ENG', // Default role

    selectDefect: (id) => set({ selectedDefectId: id }),
    setUserRole: (role) => set({ userRole: role }),
    getSelectedDefect: () => {
        const { defects, selectedDefectId } = get();
        return defects.find((d) => d.id === selectedDefectId);
    },
}));
