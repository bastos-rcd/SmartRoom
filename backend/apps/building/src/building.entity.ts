import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('building')
export class Building {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'name' })
	name: string

	@Column({ name: 'address' })
	address: string

	@Column({ name: 'nb_floors' })
	nbFloors: number
}
