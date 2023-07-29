export class User {
  id: string;
  username: string;
  refreshToken: string;
  accessToken: string;
}

export class UserModel extends User {
  password: string;
}
