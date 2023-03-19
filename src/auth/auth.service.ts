import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload, IAuthProps } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.usersRepository.register(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<IAuthProps> {
    try {
      const { username, password } = authCredentialsDto;

      const user: User = await this.usersRepository.findOne({
        where: {
          username,
        },
      });

      if (!user) {
        throw new NotFoundException(
          `There is no user under username ${username}`,
        );
      }

      await this.verifyPassword(password, user.password);

      const payload: IJwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);

      user.password = undefined;

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }
}
