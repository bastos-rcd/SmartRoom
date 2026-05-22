import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('equipment')
export class Equipment {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'name' })
	name: string

	@Column({ name: 'type' })
	type: string

	@Column({ name: 'available' })
	available: number

	@Column({ name: 'room_id' })
	roomId: number
}
