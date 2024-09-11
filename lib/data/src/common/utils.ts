import { z, ZodType } from 'zod';

export type DTO<T extends ZodType> = z.infer<T>;
