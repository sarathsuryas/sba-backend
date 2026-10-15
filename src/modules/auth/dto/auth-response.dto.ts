export class AuthResponseDto {
  /** @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... */
  accessToken: string;
  /** @example Bearer */
  tokenType: 'Bearer';
  /**
   * Token lifetime, e.g. '15m'.
   * @example 15m
   */
  expiresIn: string;
  /**
   * When true, the client should send the user to change their password.
   * @example true
   */
  mustChangePassword: boolean;
}
