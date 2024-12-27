import * as bcrypt from 'bcryptjs';
import * as path from 'path';

export const getEnvPath = (): string => {
  const envMap = {
    docker: 'env/.env.docker',
    local: 'env/.env.local',
    dev: 'env/.env.dev',
    prod: 'env/.env.prod',
    default: '.env',
  };

  return envMap[process.env.NODE_ENV] || envMap.default;
};

export const cryptPlainText = async (plainText: string): Promise<string> => {
  const saltOrRounds = 10;
  return await bcrypt.hash(plainText, saltOrRounds);
};

export const decryptPlainText = async (
  plainText: string,
  hashedText: string,
): Promise<boolean> => await bcrypt.compare(plainText, hashedText);

export const generateRandomString = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@?$%^&*()-_=+<>[]{}|;:,./';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const getBaseDir = () => {
  const envDir = process.env.BASE_DIR;
  return envDir === undefined
    ? path.resolve(__dirname, '..', '..', 'data')
    : envDir;
};
