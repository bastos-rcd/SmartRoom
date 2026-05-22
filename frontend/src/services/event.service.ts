import API from './api'

import type { Event } from '../types/event'

export const eventService = {
	async getEvents(): Promise<Event[]> {
		const response = await API.get('/reservations')

		return response.data
	},

	async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
		const response = await API.post('/reservations', event)
		return response.data
	},

	async deleteEvent(id: number): Promise<void> {
		await API.delete(`/reservations/${id}`)
	},
}
