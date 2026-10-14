export interface AppConfig {
  port: number;
  database: {
    url: string;
    poolMax: number;
  };
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL as string,
    poolMax: parseInt(process.env.DB_POOL_MAX ?? '10', 10),
  },
});
