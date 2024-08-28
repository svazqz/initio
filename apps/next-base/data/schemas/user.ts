/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod';

const Info = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z
    .string()
    .regex(
      /^[\+]?([0-9][\s]?|[0-9]?)([(][0-9]{3}[)][\s]?|[0-9]{3}[-\s\.]?)[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    )
    .min(11)
    .max(11),
});

const PersonalInfo = z.object({
  dob: z
    .string()
    .regex(
      /^(((\d{4}\/((0[13578]\/|1[02]\/)(0[1-9]|[12]\d|3[01])|(0[13456789]\/|1[012]\/)(0[1-9]|[12]\d|30)|02\/(0[1-9]|1\d|2[0-8])))|((([02468][048]|[13579][26])00|\d{2}([13579][26]|0[48]|[2468][048])))\/02\/29)){0,10}$/i,
    ),
  ssnLast4: z.string().min(4),
  id: z
    .object({
      type: z.string(),
      frontImage64: z.string(),
      backImage64: z.string().optional(),
    })
    .optional(),
});

export namespace User {
  export const Schemas = {
    Info,
    PersonalInfo,
  };
}
