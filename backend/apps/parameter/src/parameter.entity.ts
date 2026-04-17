import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  /* ManyToOne,
  JoinColumn, */
} from "typeorm";
/* import { User } from "./user.entity";
import { Room } from "./room.entity"; */

@Entity("parameter")
export class Parameter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "text" })
  value: string;

  @Column({ name: "user_id" })
  userId: number;

  /* @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: "user_id" })
  user: User; */
}
