import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from './auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {
    super({
      secretOrKey: 'nestSecret',
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const { username } = payload;
    const user: User = await this.usersRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }
    return user;
  }
}
