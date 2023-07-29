import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { IBcryptService } from '../../domain/adapters/bcrypt.interface';
import { IJwtService, IJwtServicePayload } from '../../domain/adapters/jwt.interface';
import { JWTConfig } from '../../domain/config/jwt.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { UserRepository } from '../../domain/repositories/userRepository.interface';

export class RegisterUseCases {
  constructor(private readonly userRepository: UserRepository, private readonly bcryptService: IBcryptService) {}

  async userShouldNotExist(username: string): Promise<boolean> {
    return !(await this.userRepository.getUserByUsername(username));
  }

  async registerUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.createUser(username, await this.bcryptService.hash(password));
    return user;
  }
}
