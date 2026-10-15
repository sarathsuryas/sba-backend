export class AuthResponseDto {
  accessToken: string;
  tokenType: 'Bearer';
  /** Token lifetime, e.g. '15m'. */
  expiresIn: string;
  /** When true, the client should send the user to change their password. */
  mustChangePassword: boolean;
}
