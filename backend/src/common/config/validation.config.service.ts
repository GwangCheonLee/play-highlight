import { ValidationPipe } from '@nestjs/common';
import * as Joi from 'joi';

export const validationPipeConfig = () => {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  });
};

export const validationSchemaConfig = () => {
  return Joi.object({
    TZ: Joi.string().default('UTC'),
    APPLICATION_ENV: Joi.string().required(),
    SERVER_PORT: Joi.number().default(3000),
    DB_DATABASE: Joi.string().required(),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  });
};
