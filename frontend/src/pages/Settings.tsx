import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../types/user'
import { authService } from '../services/auth.service'
import { userService } from '../services/user.service'
import PersonIcon from '@mui/icons-material/Person'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Menu from '../components/Menu'

export default function Settings() {
	const navigate = useNavigate()

	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const [firstName, setFirstName] = useState<string>('')
	const [lastName, setLastName] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [formSaving, setFormSaving] = useState<boolean>(false)

	const [mobileOpen, setMobileOpen] = useState<boolean>(false)
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)

	const [successToast, setSuccessToast] = useState('')
	const [errorToast, setErrorToast] = useState('')

	const showSuccess = (msg: string) => {
		setSuccessToast(msg)
		setTimeout(() => setSuccessToast(''), 4000)
	}

	const showError = (msg: string) => {
		setErrorToast(msg)
		setTimeout(() => setErrorToast(''), 4000)
	}

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	useEffect(() => {
		const initData = async () => {
			try {
				if (!authService.isAuthenticated()) {
					navigate('/login')
					return
				}

				const currentUser = await authService.getUser()

				setUser(currentUser)
				setFirstName(currentUser.firstName)
				setLastName(currentUser.lastName)
				setEmail(currentUser.email)
			} catch (err) {
				console.error(err)
				showError('Impossible de charger vos données.')
				if (!authService.isAuthenticated()) {
					navigate('/login')
				}
			} finally {
				setLoading(false)
			}
		}

		initData()
	}, [navigate])

	const handleSaveInfo = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!user) return

		if (!firstName.trim() || !lastName.trim() || !email.trim()) {
			showError("Le prénom, le nom et l'adresse email sont requis.")
			return
		}

		setFormSaving(true)
		try {
			const updateData: Partial<User> = {
				firstName,
				lastName,
				email,
			}

			if (password.trim() !== '') {
				updateData.password = password
			}

			const updatedUser = await userService.updateUser(user.id, updateData)
			setUser(updatedUser)
			setPassword('')
			showSuccess('Informations mises à jour avec succès !')
			window.location.reload()
		} catch (err) {
			console.error(err)
			showError('Erreur lors de la mise à jour des informations.')
		} finally {
			setFormSaving(false)
		}
	}

	if (loading) {
		return (
			<div
				className="d-flex justify-content-center align-items-center min-vh-100"
				style={{ backgroundColor: '#f8fafc' }}
			>
				<div
					className="spinner-border text-emerald"
					role="status"
					style={{ width: '3rem', height: '3rem', color: '#10b981' }}
				>
					<span className="visually-hidden">Chargement...</span>
				</div>
			</div>
		)
	}

	return (
		<>
			<Menu />

			<div
				className="container-fluid mx-auto py-4 px-3 px-md-5"
				style={{ backgroundColor: '#f8fafc', maxWidth: '800px' }}
			>
				{isMobile && mobileOpen && (
					<div
						className="menu-mobile-overlay"
						onClick={() => setMobileOpen(false)}
						style={{ zIndex: 1040 }}
					/>
				)}
				<div>
					<div className="tab-content animate-fade-in">
						<div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4 p-md-5">
							<div className="border-bottom pb-3 mb-4">
								<h2 className="h4 text-dark fw-bold m-0 d-flex align-items-center gap-2">
									<PersonIcon sx={{ color: '#10b981' }} />
									Mes informations
								</h2>
								<p className="text-secondary small m-0 mt-1">
									Modifier les détails de votre compte utilisateur.
								</p>
							</div>

							<form
								onSubmit={handleSaveInfo}
								className="d-flex flex-column gap-3"
							>
								<div className="row g-3">
									<div className="col-12 col-md-6 text-start">
										<label
											className="form-label small fw-bold text-secondary text-uppercase mb-1"
											htmlFor="firstName"
										>
											Prénom
										</label>
										<input
											id="firstName"
											type="text"
											className="form-control rounded-3 p-3 bg-light border-light-subtle focus-emerald shadow-none"
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											placeholder="John"
											required
										/>
									</div>

									<div className="col-12 col-md-6 text-start">
										<label
											className="form-label small fw-bold text-secondary text-uppercase mb-1"
											htmlFor="lastName"
										>
											Nom
										</label>
										<input
											id="lastName"
											type="text"
											className="form-control rounded-3 p-3 bg-light border-light-subtle focus-emerald shadow-none"
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											placeholder="Doe"
											required
										/>
									</div>
								</div>

								<div className="text-start">
									<label
										className="form-label small fw-bold text-secondary text-uppercase mb-1"
										htmlFor="email"
									>
										Adresse e-mail
									</label>
									<input
										id="email"
										type="email"
										className="form-control rounded-3 p-3 bg-light border-light-subtle focus-emerald shadow-none"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="john.doe@gmail.com"
										required
									/>
								</div>

								<div className="text-start">
									<label
										className="form-label small fw-bold text-secondary text-uppercase mb-1"
										htmlFor="password"
									>
										Nouveau mot de passe{' '}
										<span className="text-muted text-lowercase fw-normal">
											(laisser vide pour ne pas modifier)
										</span>
									</label>
									<div className="position-relative w-100">
										<input
											id="password"
											type={showPassword ? 'text' : 'password'}
											className="form-control rounded-3 p-3 bg-light border-light-subtle focus-emerald shadow-none"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="••••••••"
											style={{ paddingRight: '45px' }}
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent text-secondary pe-3 d-flex align-items-center"
											style={{ cursor: 'pointer', zIndex: 5 }}
										>
											{showPassword ? (
												<VisibilityOffIcon sx={{ fontSize: '1.3rem' }} />
											) : (
												<VisibilityIcon sx={{ fontSize: '1.3rem' }} />
											)}
										</button>
									</div>
								</div>

								<div className="text-end mt-4 pt-2 border-top border-light-subtle">
									<button
										type="submit"
										disabled={formSaving}
										className="btn btn-emerald rounded-pill px-5 py-3 fw-bold shadow-sm w-100 w-sm-auto"
										style={{ fontSize: '0.95rem' }}
									>
										{formSaving
											? 'Enregistrement...'
											: 'Enregistrer les modifications'}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>

				{successToast && (
					<div
						className="position-fixed bottom-0 end-0 m-4 p-3 rounded-3 text-white shadow-lg d-flex align-items-center gap-3 border border-success-subtle animate-toast"
						style={{
							backgroundColor: 'rgba(15, 23, 42, 0.95)',
							backdropFilter: 'blur(8px)',
							zIndex: 9999,
							minWidth: '280px',
							maxWidth: 'calc(100vw - 32px)',
						}}
					>
						<CheckCircleIcon sx={{ color: '#4ade80', fontSize: '1.8rem' }} />
						<div className="text-start">
							<h6
								className="m-0 fw-semibold text-success"
								style={{ color: '#4ade80' }}
							>
								Succès
							</h6>
							<small className="text-white-50">{successToast}</small>
						</div>
					</div>
				)}

				{errorToast && (
					<div
						className="position-fixed bottom-0 end-0 m-4 p-3 rounded-3 text-white shadow-lg d-flex align-items-center gap-3 border border-danger-subtle animate-toast"
						style={{
							backgroundColor: 'rgba(15, 23, 42, 0.95)',
							backdropFilter: 'blur(8px)',
							zIndex: 9999,
							minWidth: '280px',
							maxWidth: 'calc(100vw - 32px)',
						}}
					>
						<ErrorIcon sx={{ color: '#f87171', fontSize: '1.8rem' }} />
						<div className="text-start">
							<h6
								className="m-0 fw-semibold text-danger"
								style={{ color: '#f87171' }}
							>
								Erreur
							</h6>
							<small className="text-white-50">{errorToast}</small>
						</div>
					</div>
				)}

				<style>{`
        .bullet-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
          display: inline-block;
          animation: pulse 2s infinite;
        }

        .hover-emerald:hover {
          color: #4ade80 !important;
        }

        .focus-emerald:focus {
          border-color: #4ade80 !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.15) !important;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
			</div>
		</>
	)
}
