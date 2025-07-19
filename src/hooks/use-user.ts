import { IUser } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  user?: IUser;
  token?: string;
  setUser: (_user?: IUser) => void;
  clearUser: () => void;
  setToken: (token?: string) => void;
  clearToken: () => void;
};

export const useUser = create(
  persist<UserStore>(
    (set) => ({
      user: undefined,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: undefined }),
      token: undefined,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: undefined }),
    }),
    {
      name: "userLogin",
    }
  )
);

export default useUser;
