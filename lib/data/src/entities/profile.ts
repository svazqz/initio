import { z, ZodObject, ZodType } from 'zod';

const genericFormSchema = z.object({
  stringField: z.string().optional(),
  numberField: z.number().optional(),
  links: z.array(z.string()).optional(),
  dropdownSelect: z.string().refine(
    (value) => {
      const validOptions = ['Option1', 'Option2', 'Option3'];
      return validOptions.includes(value);
    },
    { message: 'Option not valid' },
  ),
});

const basicInformationFormSchema = z.object({
  listingTitle: z.string().min(3).max(50),
  category: z.string().refine(
    (value) => {
      const validOptions = ['Option1', 'Option2', 'Option3'];
      return validOptions.includes(value);
    },
    { message: 'Option not valid' },
  ),
  serviceCategory: z.string().refine(
    (value) => {
      const validOptions = ['Option1', 'Option2', 'Option3'];
      return validOptions.includes(value);
    },
    { message: 'Option not valid' },
  ),
  keyword: z.string().min(3).max(50),
});

const detailsFormSchema = z.object({
  description: z.string().min(3).max(100),
  videoLink: z.string().refine(
    (value) => {
      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      return urlPattern.test(value);
    },
    {
      message: 'Register a valid link to video.',
    },
  ),
  phone: z.number().min(10),
  email: z.string().email(),
  facebook: z
    .string()
    .refine((value) => /^https:\/\/www\.facebook\.com\/.*/i.test(value), {
      message: 'Register a valid link to facebook.',
    }),
  instagram: z
    .string()
    .refine((value) => /^https:\/\/www\.instagram\.com\/.*/i.test(value), {
      message: 'Register a valid link to instagram.',
    }),
  youtube: z
    .string()
    .refine((value) => /^https:\/\/www\.youtube\.com\/.*/i.test(value), {
      message: 'Register a valid link to Youtube',
    }),
  twitter: z
    .string()
    .refine((value) => /^https:\/\/twitter\.com\/.*/i.test(value), {
      message: 'Register a valid link to twitter.',
    }),
  whatsapp: z.string().refine((value) => /^https:\/\/wa\.me\/.*/i.test(value), {
    message: 'Register a valid link to whatsapp.',
  }),
  skype: z.string().refine((value) => /^skype:.*/i.test(value), {
    message: 'Register a valid link to skype.',
  }),
  minPrice: z.number(),
  maxPrice: z.number(),
});

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];

const isImageExtension = (filename: string) => {
  const ext = filename?.split('.').pop()?.toLowerCase();
  return ext ? imageExtensions.includes(ext) : false;
};

const galleryFormSchema = z.object({
  file: z
    .object({
      name: z.string(),
      type: z.string(),
      size: z.number(),
    })
    .refine((data) => isImageExtension(data.name), {
      message: 'File extension is not valid for an image.',
    }),
});
