import { Controller, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthService } from 'src/application/services/src/auth.service';
import { ForgotPasswordDto } from 'src/presentation/dtos/auth/forgot-password.dto';
import { LoginDto } from 'src/presentation/dtos/auth/login.dto';
import { RegisterDto } from 'src/presentation/dtos/auth/register.dto';
import { ResetPasswordDto } from 'src/presentation/dtos/auth/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto) {
    console.log(dto);
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT token' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('confirm/token/:token')
  @ApiOperation({ summary: 'Confirm user email' })
  async confirm(@Param('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  async forgot(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password/:token')
  @ApiOperation({ summary: 'Reset user password' })
  async reset(@Param('token') token: string, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(token, dto.password);
  }
}
