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

export const getBaseDir = () => {
  const envDir = process.env.BASE_DIR;
  return envDir === undefined
    ? path.resolve(__dirname, '..', '..', 'data')
    : envDir;
};
