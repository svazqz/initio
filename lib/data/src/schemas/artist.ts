/* eslint-disable @typescript-eslint/no-namespace */
import { Dayjs } from 'dayjs';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require('dayjs');

const commonPersonalInfo = {
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dob: z
    .instanceof(dayjs as unknown as typeof Dayjs)
    .refine(
      (date) => {
        return date.isAfter('1950-01-01') && date.isBefore('2006-01-01');
      },
      {
        message: 'Date must be between 1950-01-01 and 2006-01-01',
      },
    )
    .transform((dob) => ({
      day: dob.date(),
      month: dob.month() + 1,
      year: dob.year(),
    })),
  addressLine1: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}(?:[-\s]\d{4})?$/i),
  city: z.string().min(1),
  state: z.string().min(1),
  email: z.string().email(),
  ssnLast4: z.string().min(4),
  phone: z
    .string()
    .regex(/^\+?[0-9]*$/)
    .min(10)
    .max(15),
  idSession: z.string().optional(),
  // frontImage64: z.string().optional(),
  // backImage64: z.string().optional(),
};

const CreatePersonalInfo = z.object(commonPersonalInfo);
const EditPersonalInfo = z.object({
  ...commonPersonalInfo,
  artistId: z.string().optional(),
});

const VerificationInfo = z.object({
  frontImage64: z.any(),
  backImage64: z.any().optional(),
});

const ProfileInfo = z.object({
  listingTitle: z.string().min(3),
  keyword: z.string().min(1),
  category: z.string(),
  serviceCategory: z.string(),
  session_id: z.string(), // ?
});

const ProfileDetailsInfo = z.object({
  description: z.string().min(1).max(50),
  video: z.string().min(1),
  phone: z
    .string()
    .regex(/^\+?[0-9]*$/)
    .min(10)
    .max(15),
  email: z.string().email(),
  facebook: z.string().min(1),
  twitter: z.string().min(1),
  youtube: z.string().min(1),
  instagram: z.string().min(1),
  whatsApp: z.string().min(1),
  skype: z.string().min(1),
  minPrice: z.string(),
  maxPrice: z.string(),
});

const Gallery = z.object({
  url: z.any(),
  name: z.string(),
  session: z.string(),
});

const Availability = z.object({
  data: z.unknown(),
  session_id: z.string(),
});

const Calendar = z.object({
  // ?
  day: z.any(),
  type: z.string(),
  hours_Range: z.any(),
  session_id: z.string(),
});

export namespace Artist {
  export const Schemas = {
    CreatePersonalInfo,
    EditPersonalInfo,
    VerificationInfo,
    ProfileInfo,
  };
}
