import { jwtDecode } from 'jwt-decode'

import API from './api'

import type { JwtPayload } from '../types/auth'
import type { User } from '../types/user'
import { userService } from './user.service'

export const authService = {
	async login(email: string, password: string): Promise<void> {
		const response = await API.post('/login', { email, password })

		if (response.data.access_token) {
			localStorage.setItem('token', response.data.access_token)
		}
	},

	async register(
		firstName: string,
		lastName: string,
		email: string,
		password: string,
	): Promise<User> {
		const response = await API.post('/register', {
			firstName,
			lastName,
			email,
			password,
		})

		return response.data
	},

	logout(): void {
		localStorage.removeItem('token')
	},

	getToken(): string | null {
		return localStorage.getItem('token')
	},

	isAuthenticated(): boolean {
		const token = this.getToken()
		if (!token) return false

		try {
			const decoded = jwtDecode<JwtPayload>(token)
			const currentTime = Date.now() / 1000

			if (decoded.exp < currentTime) {
				this.logout()
				return false
			}

			return true
		} catch (error) {
			return false
		}
	},

	async getUser(): Promise<User> {
		const token = this.getToken()
		if (!token) throw new Error('No token found')

		try {
			const decoded = jwtDecode<JwtPayload>(token)

			const user = await userService.getUserById(Number(decoded.sub))

			return user
		} catch {
			this.logout()
			throw new Error('User not found')
		}
	},
}
