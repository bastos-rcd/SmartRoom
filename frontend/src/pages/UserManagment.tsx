import { useEffect, useState } from 'react'
import Menu from '../components/Menu'
import UserCard from '../components/UserCard'
import { userService } from '../services/user.service'
import type { User } from '../types/user'
import { authService } from '../services/auth.service'

export default function UserManagement() {
	const [data, setData] = useState<User[]>([])

	useEffect(() => {
		authService.getUser().then((user) => {
			userService.getAllUsers().then((users) => {
				setData(users.filter((u) => u.id !== user.id))
			})
		})
	}, [])

	return (
		<div>
			<Menu />
			{data.map((user) => (
				<UserCard
					key={user.id}
					{...user}
					onAction={() => {
						window.location.reload()
					}}
				/>
			))}
		</div>
	)
}
