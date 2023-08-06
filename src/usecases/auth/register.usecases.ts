import { IBcryptService } from '../../domain/adapters/bcrypt.interface';
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
