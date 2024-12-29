import * as path from 'path';

/**
 * 현재 실행 환경에 따라 적절한 .env 파일 경로를 반환합니다.
 *
 * @return {string} 적절한 .env 파일의 경로
 */
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

/**
 * 기본 데이터 디렉토리 경로를 반환합니다.
 *
 * BASE_DIR 환경 변수가 설정되어 있으면 해당 값을 반환하며,
 * 설정되지 않은 경우 기본 경로로 `../../data`를 반환합니다.
 *
 * @return {string} 데이터 디렉토리의 절대 경로
 */
export const getBaseDir = (): string => {
  const envDir = process.env.BASE_DIR;
  return envDir === undefined
    ? path.resolve(__dirname, '..', '..', 'data')
    : envDir;
};
