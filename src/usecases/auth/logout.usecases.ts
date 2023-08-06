import { UserRepository } from '../../domain/repositories/userRepository.interface';

export class LogoutUseCases {
  constructor(private readonly userRepository: UserRepository) {}

  async deleteRefreshAndAccessToken(username: string): Promise<any> {
    await this.userRepository.deleteRefreshAndAccessToken(username);
  }
}
