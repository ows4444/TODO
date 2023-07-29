export interface IJwtServicePayload {
  [key: string]: string;
  username?: string;
  id?: string;
}

export interface IJwtService {
  checkToken(token: string): Promise<any>;
  createToken(payload: IJwtServicePayload, secret: string, expiresIn: string): string;
}
