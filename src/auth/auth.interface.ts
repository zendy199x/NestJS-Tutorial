import { User } from './user.entity';

export interface IJwtPayload {
  username: string;
}

export interface IAuthProps {
  profile: User;
  accessToken: string;
}
