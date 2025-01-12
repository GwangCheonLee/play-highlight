import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], // 'localhost'를 허용된 호스트에 추가
  },
  output: 'standalone',
};

export default withNextIntl(nextConfig);
