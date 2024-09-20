import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    auth: { id: number } | null;
    setAuth: (data: { id: number } | null) => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            auth: null,
            setAuth: (data) => set({ auth: data }),
        }),
        { name: 'user' }
    )
);

export default useUserStore;
