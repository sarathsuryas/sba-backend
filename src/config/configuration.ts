export interface AppConfig {
  port: number;
  database: {
    url: string;
    poolMax: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL as string,
    poolMax: parseInt(process.env.DB_POOL_MAX ?? '10', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  },
});
