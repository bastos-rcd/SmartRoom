import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('parameter')
export class Parameter {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 150 })
	name: string

	@Column({ type: 'text' })
	value: string

	@Column({ name: 'user_id' })
	userId: number
}
