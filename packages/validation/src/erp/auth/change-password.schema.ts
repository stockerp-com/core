import { z } from 'zod';

export const changePasswordSchema = z.object({
  newPassword: z
    .string({
      required_error: 'errors:validation.required',
    })
    .refine((value) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isLongEnough = value.length >= 12;
      return (
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar &&
        isLongEnough
      );
    }, 'errors:validation.password'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
