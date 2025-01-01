import { ValidationPipe } from '@nestjs/common';
import * as Joi from 'joi';

/**
 * Generates a ValidationPipe configuration
 * @return {ValidationPipe} Configured instance of ValidationPipe
 */
export const validationPipeConfig = (): ValidationPipe => {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  });
};

/**
 * Defines a Joi validation schema for environment variables
 * @return {Joi.ObjectSchema} Joi object schema for env variables
 */
export const validationSchemaConfig = (): Joi.ObjectSchema => {
  return Joi.object({
    // 서버 설정
    TZ: Joi.string().default('UTC'),
    NODE_ENV: Joi.string().default('production'),
    SERVER_PORT: Joi.number().default(3000),
    API_PREFIX: Joi.string().default('api'),

    // 데이터베이스
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_USER_NAME: Joi.string().required(),
    DB_USER_PASSWORD: Joi.string().required(),

    // Redis
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_USERNAME: Joi.string().optional(),
    REDIS_PASSWORD: Joi.string().optional(),

    // JWT
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),

    // Google OAuth
    GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
    GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_AUTH_CALLBACK_URL: Joi.string().required(),
    GOOGLE_AUTH_BASE_REDIRECT_URL: Joi.string().required(),

    // AWS S3
    AWS_S3_REGION: Joi.string().required(),
    AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
    AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_S3_ENDPOINT: Joi.string().required(),
    AWS_S3_BUCKET_NAME: Joi.string().default('play-highlight'),

    // 2FA
    TWO_FACTOR_AUTHENTICATION_APP_NAME: Joi.string().required(),
  });
};
