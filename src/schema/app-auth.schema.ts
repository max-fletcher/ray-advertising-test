import { z } from 'zod';
import { imageValidationS3Rule } from './common.schema';

export const phoneNoSchema = z.object({
  phone: z.string({ required_error: "Phone no. is required" }).trim().min(3, { message: 'Phone no. has to be at least 3 characters long.' }).max(255, { message: 'Phone no. cannot exceed 255 characters.' }),
});

export type PhoneNoSchema = z.infer<
  typeof phoneNoSchema
>;

export const appVerifyOtpSchema = z.object({
  otp: z.string().min(6, { message: 'OTP has to be exactly 6 characters long.' }).max(6, { message: 'OTP has to be exactly 6 characters long.' })
        .regex(new RegExp(/^[0-9]*$/), { message: 'OTP can only contain numbers.' }),
});

export type AppVerifyOtpSchema = z.infer<
  typeof appVerifyOtpSchema
>;

export const nameAndUsernameSchema = z.object({
  name: z.string().trim().min(3, { message: 'Name has to be at least 3 characters long.' }).max(255, { message: 'Name cannot exceed 255 characters.' }).optional(),
  username: z.string({ required_error: "Username is required" }).trim().min(3, { message: 'Username has to be at least 3 characters long.' }).max(255, { message: 'Username cannot exceed 255 characters.' }),
});

export type NameAndUsernameSchema = z.infer<
  typeof nameAndUsernameSchema
>;

export const nameSchema = z.object({
  name: z.string({ required_error: "Username is required" }).trim().min(3, { message: 'Name has to be at least 3 characters long.' }).max(255, { message: 'Name cannot exceed 255 characters.' }),
});

export type nameSchema = z.infer<
  typeof nameSchema
>;

export const usernameSchema = z.object({
  username: z.string({ required_error: "Username is required" }).trim().min(3, { message: 'Username has to be at least 3 characters long.' }).max(255, { message: 'Username cannot exceed 255 characters.' }),
});

export type UsernameSchema = z.infer<
  typeof usernameSchema
>;

export const emailSchema = z.object({
  email: z.string({ required_error: 'Email is required.' })
            .email({ message: 'Invalid email format. Please provide a valid email.' })
            .min(1, { message: 'Email is required.' })
            .max(255, { message: 'Email cannot exceed 255 characters.' }),
});

export type EmailSchema = z.infer<
  typeof emailSchema
>;

export const whatsappNoSchema = z.object({
  whatsapp_no: z.string({ required_error: "Whatsapp no. is required" }).trim().min(3, { message: 'Whatsapp no. has to be at least 3 characters long.' }).max(255, { message: 'WhatsApp no. cannot exceed 255 characters.' }),
});

export type WhatsappNoSchema = z.infer<
  typeof whatsappNoSchema
>;

export const avatarSchama = z.object({
  avatar_url: z.string({ required_error: "Avatar is required" }).trim().min(1, { message: 'Avatar is required.' }).max(255, { message: 'Max characters reached.' }),
});

export type AvatarSchema = z.infer<
  typeof avatarSchama
>;

export const profileImageSchama = z.object({
  avatar_url: z.array(imageValidationS3Rule).optional().nullable(),
  profile_image: z.array(imageValidationS3Rule)
});

export type profileImageSchama = z.infer<
  typeof profileImageSchama
>;