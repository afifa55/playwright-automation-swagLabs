import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env'), quiet: true });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const env = {
  baseUrl: required('BASE_URL'),
  standardUser: required('STANDARD_USER'),
  lockedOutUser: required('LOCKED_OUT_USER'),
  problemUser: required('PROBLEM_USER'),
  performanceGlitchUser: required('PERFORMANCE_GLITCH_USER'),
  errorUser: required('ERROR_USER'),
  password: required('PASSWORD'),
  invalidUser: required('INVALID_USER'),
  invalidPassword: required('INVALID_PASSWORD'),
  firstName: required('FIRST_NAME'),
  lastName: required('LAST_NAME'),
  postalCode: required('POSTAL_CODE'),
} as const;
