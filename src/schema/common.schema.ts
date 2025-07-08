import { z } from 'zod';

export const imageValidationRule = z.object({
  fieldname: z.string(),
  originalname: z.union([
    z.string().endsWith('.jpg', { message: "File type must be jpg, jpeg, png or webp" }),
    z.string().endsWith('.jpeg', { message: "File type must be jpg, jpeg, png or webp" }),
    z.string().endsWith('.png', { message: "File type must be jpg, jpeg, png or webp" }),
    z.string().endsWith('.webp', { message: "File type must be jpg, jpeg, png or webp" })
  ]),
  mimetype: z.union([
    z.string().includes('image/jpg', { message: "File type must be jpg, jpeg, png or webp" }), 
    z.string().includes('image/jpeg', { message: "File type must be jpg, jpeg, png or webp" }), 
    z.string().includes('image/png', { message: "File type must be jpg, jpeg, png or webp" }), 
    z.string().includes('image/webp', { message: "File type must be jpg, jpeg, png or webp" })
  ]),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
  size: z.number().max(2242880, { message: "File size must be less than 2MB" }),
})

export const imageValidationS3Rule = z.object({
  fieldname: z.string(),
  originalname: z.union([
    z.string().endsWith('.jpg', { message: "File type must be jpg, jpeg, png or webp" }),
    z.string().endsWith('.jpeg', { message: "File type must be jpg, jpeg, png or webp" }),
    z.string().endsWith('.png', { message: "File type must be jpg, jpeg, png or webp" }),
    z.string().endsWith('.webp', { message: "File type must be jpg, jpeg, png or webp" })
  ]),
  encoding: z.string(),
  bucket: z.string(),
  key: z.string(),
  acl: z.string(),
  contentType: z.string(),
  contentDisposition: z.string().nullable(),
  contentEncoding: z.string().nullable(),
  storageClass: z.string(),
  serverSideEncryption: z.string().nullable(),
  metadata: z.object({
    fieldname: z.string().nullable(),
  }),
  mimetype: z.union([
    z.string().includes('image/jpg', { message: "File type must be jpg, jpeg, png or webp" }), 
    z.string().includes('image/jpeg', { message: "File type must be jpg, jpeg, png or webp" }), 
    z.string().includes('image/png', { message: "File type must be jpg, jpeg, png or webp" }), 
    z.string().includes('image/webp', { message: "File type must be jpg, jpeg, png or webp" })
  ]),
  location: z.string(),
  size: z.number().max(2242880, { message: "File size must be less than 2MB" }),
  etag: z.string(),
})