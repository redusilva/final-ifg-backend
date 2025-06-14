import dotenv from 'dotenv';
import zod from 'zod';

dotenv.config();

const envSchema = zod.object({
    PORT: zod.string().regex(/^\d+$/).transform(Number),
    PASSWORD_SALTS: zod.string().regex(/^\d+$/).transform(Number),
    MONGO_URI: zod.string().url(),
    JWT_SECRET: zod.string().min(1),
});

const env = envSchema.safeParse(process.env);
if (!env.success) {
    console.error('Invalid environment variables:', env.error.format());
    process.exit(1);
}

export const config = env.data;