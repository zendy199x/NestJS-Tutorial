import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const user = await this.authService.signIn(authCredentialsDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
