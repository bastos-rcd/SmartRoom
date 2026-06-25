import API from './api'

import type { Building } from '../types/building'

export const buildingService = {
	async getBuildings(): Promise<Building[]> {
		const response = await API.get('/buildings')

		return response.data
	},

	async getBuildingById(id: number): Promise<Building> {
		const response = await API.get(`/buildings/${id}`)

		return response.data
	},

	async createBuilding(building: Omit<Building, 'id'>): Promise<Building> {
		const response = await API.post('/buildings', building)

		return response.data
	},

	async updateBuilding(
		id: number,
		name: string,
		address: string,
		nbFloors: number,
	): Promise<Building> {
		const response = await API.put(`/buildings/${id}`, {
			name,
			address,
			nbFloors,
		})

		return response.data
	},

	async deleteBuilding(id: number) {
		await API.delete(`/buildings/${id}`)
	},
}
