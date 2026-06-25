import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('user')
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'first_name', length: 100 })
	firstName: string

	@Column({ name: 'last_name', length: 100 })
	lastName: string

	@Column({ unique: true, length: 150 })
	email: string

	@Column({ length: 255 })
	password: string

	@Column({
		type: 'varchar',
		length: 20,
		default: 'user',
	})
	role: 'admin' | 'user'

	@Column({ type: 'int' })
	status: number
}
