import { z } from 'zod';
import { Decimal } from 'decimal.js';

export const stringField = z
  .string({
    required_error: 'errors:validation.required',
  })
  .min(1, 'errors:validation.min?count=1')
  .max(191, 'errors:validation.max?count=191');

export const numberField = z.number({
  required_error: 'errors:validation.required',
});

export const decimalField = z.instanceof(Decimal, {
  message: 'errors:validation.decimal',
});

export const booleanField = z.boolean({
  required_error: 'errors:validation.required',
});

export const dateField = z.date({
  required_error: 'errors:validation.required',
});

export const enumField = <T extends readonly [string, ...string[]]>(
  values: T,
) => {
  return z.enum(values, {
    required_error: 'errors:validation.required',
    invalid_type_error: 'errors:validation.invalid_type',
  });
};

export const emailField = z
  .string({
    required_error: 'errors:validation.required',
  })
  .email({
    message: 'errors:validation.email',
  });

export const fileField = z.object({
  name: z.string(),
  key: z.string(),
  size: z.number(),
  type: z.string(),
});

export const otpField = z
  .string({
    required_error: 'errors:validation.required',
  })
  .length(6, {
    message: 'errors:validation.length?count=6',
  })
  .regex(/^\d+$/, {
    message: 'errors:validation.numeric',
  });

export const passwordField = z
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
  }, 'errors:validation.password');

export const _readManySchema = z.object({
  search: z.string().optional(),
  limit: z
    .enum(['10', '25', '50', '100', '250'])
    .default('10')
    .transform((value) => parseInt(value)),
});

export const orderByField = z.enum(['asc', 'desc']).optional();

export const findManySchema = z.object({
  ..._readManySchema.shape,
  page: z.number().min(1).default(1),
});

export const findManyInfiniteSchema = z.object({
  ..._readManySchema.shape,
  cursor: z.number().nullish(),
});
