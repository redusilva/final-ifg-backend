import zod from 'zod';

export const CreateUserValidator = zod.object({
    name: zod.string().min(3).max(50),
    email: zod.string().email().max(100),
    password: zod.string().min(8).max(100)
});

export type CreateUserValidatorType = zod.infer<typeof CreateUserValidator>;