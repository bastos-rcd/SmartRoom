import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  /* ManyToOne,
  JoinColumn, */
} from "typeorm";
/* import { User } from "./user.entity";
import { Room } from "./room.entity"; */

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

  /* @ManyToOne(() => User, (user) => user.reservations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User; */

  @Column({ name: "room_id" })
  roomId: number;

  /* @ManyToOne(() => Room, (room) => room.reservations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "room_id" })
  room: Room; */
}
