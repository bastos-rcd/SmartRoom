import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("room")
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "capacity" })
  capacity: number;

  @Column({ name: "floor" })
  floor: number;

  @Column({ name: "state" })
  state: number;

  @Column({ name: "location" })
  location: string;

  @Column({ name: "building_id" })
  buildingId: number;
}
