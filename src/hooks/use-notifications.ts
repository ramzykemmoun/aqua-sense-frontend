import { Notification } from "@/types/notification";
import { create } from "zustand";

type NotificationsStore = {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
};

export const useNotifications = create<NotificationsStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: (notification) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n !== notification),
    })),
  setNotifications: (notifications) => set({ notifications }),
}));
