import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Observable } from 'rxjs'

import { USER_SERVICE, UserMessages } from '@app/shared'
import { User } from 'apps/user/src/user.entity'

import { AuthService } from '../auth/auth.service'
import {
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { LoginResponseDto } from './dto/login-response.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { RegisterResponseDto } from './dto/register-response.dto'

@ApiTags('Authentification')
@Controller()
export class AuthController {
	constructor(
		@Inject(USER_SERVICE)
		private readonly userClient: ClientProxy,
		private readonly authService: AuthService,
	) {}

	@Post('register')
	@ApiOperation({ summary: "Inscription de l'utilisateur" })
	@ApiOkResponse({
		type: RegisterResponseDto,
		description: 'Utilisateur enregistré avec succès.',
	})
	@ApiResponse({ status: 400, description: 'Email déjà existant.' })
	register(@Body() user: RegisterDto): Observable<User> {
		return this.userClient.send(UserMessages.CREATE_USER, {
			...user,
			role: 'user',
			status: 1,
		})
	}

	@Post('login')
	@ApiOperation({ summary: "Connexion de l'utilisateur et génération du JWT" })
	@ApiOkResponse({
		type: LoginResponseDto,
		description: 'Authentification réussie.',
	})
	@ApiResponse({ status: 401, description: 'Identifiants incorrects.' })
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto)
	}
}
