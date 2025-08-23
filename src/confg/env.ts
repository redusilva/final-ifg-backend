import dotenv from 'dotenv';
import zod from 'zod';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const envSchema = zod.object({
    PORT: zod.string().regex(/^\d+$/).transform(Number),
    MONGO_URI: zod.string().url(),
    AUTH_SERVICE_URL: zod.string().url(),
});

const env = envSchema.safeParse(process.env);
if (!env.success) {
    console.error('Invalid environment variables:', env.error.format());
    process.exit(1);
}

export const config = env.data;