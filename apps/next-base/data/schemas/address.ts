import { z } from 'zod';

const ProviderUser = z.object({
  userId: z.string(),
  addressLine1: z.string().min(1),
  addressLine2: z.string(),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}(?:[-\s]\d{4})?$/i),
});
