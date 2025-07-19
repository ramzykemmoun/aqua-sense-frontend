export interface Notification {
  id: string;
  type:
    | "like"
    | "comment"
    | "follow"
    | "system"
    | "warning"
    | "critical"
    | "bacteria";
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  pondId?: string;
  severity?: "low" | "medium" | "high" | "critical";
}
