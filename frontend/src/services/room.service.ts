import API from './api'

import type { Room } from '../types/room'

export const roomService = {
	async getRooms(): Promise<Room[]> {
		const response = await API.get(`/rooms`)

		return response.data
	},

	async getRoomById(id: number): Promise<Room> {
		const response = await API.get(`/rooms/${id}`)

		return response.data
	},

	async createRoom(room: Omit<Room, 'id'>): Promise<Room> {
		const response = await API.post('/rooms', room)
		return response.data
	},

	async updateRoom(
		id: number,
		name: string,
		capacity: number,
		floor: number,
		location: string,
		buildingId: number,
	): Promise<Room> {
		const response = await API.put(`/rooms/${id}`, {
			name,
			capacity,
			floor,
			location,
			buildingId,
		})
		return response.data
	},

	async deleteRoom(id: number) {
		await API.delete(`/rooms/${id}`)
	},
}
