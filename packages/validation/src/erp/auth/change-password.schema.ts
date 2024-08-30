import { z } from 'zod';
import { passwordField } from '../../utils/common.js';

export const changePasswordSchema = z.object({
  newPassword: passwordField,
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
