import { z } from 'zod';
import { imageValidationRule } from './common.schema';

export const createAppUserSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .max(255, { message: 'Email cannot exceed 255 characters.' }),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .max(255, { message: 'Password cannot exceed 255 characters.' }),
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .max(255, { message: 'First name cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .max(255, { message: 'Last name cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  avatarUrl: z.array(imageValidationRule).optional().nullable(),
});

export const updateAppUserSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .max(255, { message: 'Password cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .max(255, { message: 'First name cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .max(255, { message: 'Last name cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  avatarUrl: z.array(imageValidationRule).optional().nullable(),
});