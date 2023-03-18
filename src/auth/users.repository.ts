import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super('User', dataSource.createEntityManager());
  }

  async register(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;
    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = this.create({ username, password: hashedPassword });

    try {
      await this.save(createdUser);

      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      // Duplicate user
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
