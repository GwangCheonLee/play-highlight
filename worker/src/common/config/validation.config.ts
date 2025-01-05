import * as Joi from 'joi';

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
    PROJECT_NAME: Joi.string().default('play-highlight'),

    // 데이터베이스
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_USER_NAME: Joi.string().required(),
    DB_USER_PASSWORD: Joi.string().required(),

    // RabbitMQ
    RABBITMQ_URLS: Joi.string().required(),
    RABBITMQ_QUEUE: Joi.string().required(),
    RABBITMQ_QUEUE_DURABLE: Joi.boolean().default(false),

    // AWS S3
    AWS_S3_REGION: Joi.string().required(),
    AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
    AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_S3_ENDPOINT: Joi.string().required(),
  });
};
