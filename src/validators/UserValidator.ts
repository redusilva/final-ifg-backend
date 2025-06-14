import zod from 'zod';

export const CreateUserValidator = zod.object({
    name: zod.string().min(3).max(50),
    email: zod.string().email().max(100),
    password: zod.string().min(8).max(100)
});

export type CreateUserValidatorType = zod.infer<typeof CreateUserValidator>;

export const LoginUserValidator = zod.object({
    email: zod.string().email().max(100),
    password: zod.string().min(8).max(100)
});

export type LoginUserValidatorType = zod.infer<typeof LoginUserValidator>;

export const ValidateTokenSchema = zod.object({
    token: zod.string().min(1)
});

export type ValidateTokenType = zod.infer<typeof ValidateTokenSchema>;