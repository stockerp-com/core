import { z } from 'zod';
import { emailField, otpField, passwordField } from '../../utils/common.js';

export const restorePasswordSendOtpSchema = z.object({
  email: emailField,
});

export const restorePasswordVerifyOtpSchema = z.object({
  otp: otpField,
});

export const restorePasswordNewPasswordSchema = z.object({
  newPassword: passwordField,
});

export type RestorePasswordSendOtpInput = z.infer<
  typeof restorePasswordSendOtpSchema
>;

export type RestorePasswordVerifyOtpInput = z.infer<
  typeof restorePasswordVerifyOtpSchema
>;

export type RestorePasswordNewPasswordInput = z.infer<
  typeof restorePasswordNewPasswordSchema
>;
