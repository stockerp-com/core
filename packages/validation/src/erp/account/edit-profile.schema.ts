import { z } from 'zod';
import { emailField, fileField, stringField } from '../../utils/common.js';

export const editProfileSchema = z.object({
  fullName: stringField,
  email: emailField,
  picture: fileField.nullable(),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;
