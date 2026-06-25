export interface Request {
	id: number
	type: 'incident' | 'request'
	description: string
	status: number
	creationDate: string
	userId: number
}
