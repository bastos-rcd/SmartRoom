import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  /* ManyToOne,
  JoinColumn, */
} from "typeorm";
/* import { User } from "./user.entity" */

@Entity("request")
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 20 })
  type: "incident" | "request";

  @Column({ type: "text" })
  description: string;

  @Column({ type: "int" })
  status: number;

  @CreateDateColumn({ name: "creation_date" })
  creationDate: Date;

  @Column({ name: "user_id" })
  userId: number;

  /* @ManyToOne(() => User, (user) => user.reservations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User; */
}
