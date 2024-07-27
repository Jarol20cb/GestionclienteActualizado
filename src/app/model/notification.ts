export interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: Date;
  userId: number;
  username: string;
}
