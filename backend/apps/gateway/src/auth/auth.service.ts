import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ClientProxy } from '@nestjs/microservices'
import { USER_SERVICE, UserMessages } from '@app/shared'
import { firstValueFrom } from 'rxjs'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
	constructor(
		@Inject(USER_SERVICE) private readonly userClient: ClientProxy,
		private readonly jwtService: JwtService,
	) {}

	async login(loginDto: any) {
		const user = await firstValueFrom(
			this.userClient.send(UserMessages.FIND_BY_EMAIL, loginDto.email),
		)

		if (!user) {
			throw new UnauthorizedException('Identifiants incorrects')
		}
		const isPasswordValid = await bcrypt.compare(
			loginDto.password,
			user.password,
		)
		if (!isPasswordValid) {
			throw new UnauthorizedException('Identifiants incorrects')
		}

		const payload = {
			sub: user.id,
			email: user.email,
			role: user.role,
		}

		return {
			access_token: this.jwtService.sign(payload),
		}
	}
}
