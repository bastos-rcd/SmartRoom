export interface Event {
	id: number
	startDate: string
	endDate: string
	status: 'confirmed' | 'cancelled'
	comment: string
	userId: number
	roomId: number
}
