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
