import dotenv from 'dotenv';
dotenv.config();

// Helper to parse string environment variables to numbers, with a fallback.
const parseIntOrDefault = (value: string | undefined, defaultValue: number): number => {
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

interface JwtConfig {
  secret: string;
  accessExpiry: number; // Expiry in seconds
  refreshExpiry: number; // Expiry in seconds
}

interface Config {
  jwt: JwtConfig;
  port: number | string;
  database: {
    client: string;
    connection: {
      filename: string;
    };
    useNullAsDefault: boolean;
  };
}

const config: Config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    // Default to 15 minutes (900 seconds)
    accessExpiry: parseIntOrDefault(process.env.JWT_ACCESS_EXPIRY_SECONDS, 900),
    // Default to 7 days (604800 seconds)
    refreshExpiry: parseIntOrDefault(process.env.JWT_REFRESH_EXPIRY_SECONDS, 604800),
  },
  port: process.env.PORT || 3000,
  database: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_PATH || './src/database/dev.sqlite3',
    },
    useNullAsDefault: true,
  },
};

export default config;
