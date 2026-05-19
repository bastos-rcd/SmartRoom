export interface Event {
  id: number;
  startDate: Date;
  endDate: Date;
  type: "confirmed" | "cancelled" | "modified";
  status: number;
  comment: string;
  userId: number;
  roomId: number;
}
