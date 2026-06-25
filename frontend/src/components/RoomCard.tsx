type RoomProps = {
	name: string
	capacity: number
	floor: number
	location: string
	equipment: string[]
	startDate?: string
	endDate?: string
}

export default function RoomCard(props: RoomProps) {
	const start = props.startDate
		? new Date(props.startDate.replace(' ', 'T'))
		: null
	const end = props.endDate ? new Date(props.endDate.replace(' ', 'T')) : null

	const formatDate = (date: Date) => {
		const formatted = date.toLocaleDateString('fr-FR', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		})
		// Capitalize the first letter of the weekday
		return formatted.charAt(0).toUpperCase() + formatted.slice(1)
	}

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	return (
		<div className="card h-100 border border-light-subtle rounded-4 shadow-sm overflow-hidden reservation-card">
			{/* Card Header */}
			<div className="card-header bg-slate text-black p-3 border-0">
				<h4 className="card-title h5 fw-bold mb-1">{props.name}</h4>
				<div className="text-black-50 small fw-medium">
					{props.location} • Étage {props.floor}
				</div>
			</div>

			{/* Card Body */}
			<div className="card-body p-4 d-flex flex-column gap-3">
				{/* Dynamic Period Badge */}
				{start && end && (
					<div className="bg-light border border-light-subtle rounded-3 p-3">
						<div
							className="text-uppercase text-secondary fw-bold small mb-1"
							style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
						>
							Période réservée
						</div>
						<div className="fw-bold text-dark fs-5">{formatDate(start)}</div>
						<div className="text-secondary fw-semibold fs-6 mt-1">
							De {formatTime(start)} à {formatTime(end)}
						</div>
					</div>
				)}

				{/* Details Grid */}
				<div className="d-flex flex-column gap-2">
					<div className="small text-secondary">
						<strong className="text-dark">Capacité :</strong> {props.capacity}{' '}
						places assises
					</div>
				</div>
			</div>
		</div>
	)
}
