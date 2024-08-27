import { z } from 'zod';
import {
  crudString,
  crudEmail,
  crudFile,
} from '../../create-edit-preset.schema.js';

export const editProfileSchema = z.object({
  fullName: crudString,
  email: crudEmail,
  picture: crudFile.nullable(),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;
