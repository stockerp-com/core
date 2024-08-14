import { z } from 'zod';

export const editProfileSchema = z.object({
  fullName: z
    .string({
      required_error: 'errors:validation.required',
    })
    .min(1, 'errors:validation.min?count=8')
    .max(250, 'errors:validation.max?count=250'),
  email: z
    .string({
      required_error: 'errors:validation.required',
    })
    .email({
      message: 'errors:validation.email',
    }),
  picture: z
    .object({
      name: z.string(),
      key: z.string(),
      size: z.number(),
      type: z.string(),
    })
    .nullable(),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;
