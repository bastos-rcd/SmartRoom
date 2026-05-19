import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("reservation")
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "start_date" })
  startDate: Date;

  @Column({ name: "end_date" })
  endDate: Date;

  @Column({
    type: "varchar",
    length: 20,
    default: "confirmed",
  })
  status: "confirmed" | "cancelled" | "modified";

  @Column({ type: "text" })
  comment: string;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "room_id" })
  roomId: number;
}
