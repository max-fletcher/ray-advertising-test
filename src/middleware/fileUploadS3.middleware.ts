// import { Request } from 'express';
// import multer, { FileFilterCallback } from 'multer';
// import multerS3 from 'multer-s3';
// import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';
// import { getEnvVar } from '../utils/common.utils';
// import { findCharIndex } from '../utils/string.utils';
// import {
//   fieldType,
//   s3FieldsType,
//   s3FilePaths,
// } from '../types/types/file.types';

// const accessKeyId = getEnvVar('AWS_ACCESS_KEY');
// const secretAccessKey = getEnvVar('AWS_SECRET_KEY');
// const region = getEnvVar('AWS_REGION');
// const bucket = getEnvVar('AWS_S3_BUCKET_NAME');

// export const s3FileUploader = (
//   fileFieldName: fieldType,
//   path: string | null = null,
//   maxSize = 1024 * 1024 * 30, // 30 MB default
//   perFileSize = 1024 * 1024 * 12 // 12 MB default
// ) => {
//   const s3 = new S3Client({
//     credentials: {
//       accessKeyId: accessKeyId,
//       secretAccessKey: secretAccessKey,
//     },
//     region: region,
//   });

//   const s3Storage = multerS3({
//     s3: s3,
//     bucket: bucket,
//     metadata: (req, file, cb) => {
//       cb(null, { fieldname: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       const ext = '.' + file.mimetype.split('/')[1];
//       const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
//       let fileName;
//       if 
//         (path) fileName = path + '/' + Date.now() + randomNum + ext;
//       else 
//         fileName = Date.now().toString() + randomNum + ext;

//       cb(null, fileName);
//     },
//   });

//   const additionalValidation = (
//     req: Request,
//     file: Express.Multer.File,
//     cb: FileFilterCallback,
//   ) => {
//     const fileSize = parseInt(req.headers['content-length']!);
//     if (fileSize > maxSize) {
//       req.body.file_upload_status = 'File too big to be uploaded to server';
//       return cb(null, false);
//     }

//     return cb(null, true);
//   };

//   const uploadS3 = multer({
//     storage: s3Storage,
//     fileFilter: (req, file, callback) => {
//       additionalValidation(req, file, callback);
//     },
//     limits: {
//       fileSize: perFileSize,
//     },
//   }).fields(fileFieldName);

//   return uploadS3;
// };

// export const deleteMultipleFilesS3 = async (filesPathInS3: string[]) => {
//   if(filesPathInS3.length === 0)
//     return;

//   const params = {
//     Bucket: bucket,
//     Delete: {
//       Objects: filesPathInS3.map((key) => ({ Key: key })),
//     },
//   };

//   const client = new S3Client({
//     region: region,
//     credentials: {
//       accessKeyId: accessKeyId,
//       secretAccessKey: secretAccessKey,
//     },
//   });

//   await client.send(new DeleteObjectsCommand(params));

//   return;
// };

// export const rollbackMultipleFileS3 = async (req: Request) => {
//   if (!req.files || !Object.keys(req.files).length) return;

//   const s3Filepaths: s3FilePaths[] = [];
//   Object.values(req.files!).forEach(async (fields: s3FieldsType[]) => {
//     fields.map(async (field: s3FieldsType) => {
//       s3Filepaths.push({ Key: field.key });
//     });
//   });

//   const params = {
//     Bucket: bucket,
//     Delete: {
//       Objects: s3Filepaths,
//     },
//   };

//   const client = new S3Client({
//     region: region,
//     credentials: {
//       accessKeyId: accessKeyId,
//       secretAccessKey: secretAccessKey,
//     },
//   });

//   await client.send(new DeleteObjectsCommand(params));

//   return;
// };

// export const extractS3Fullpaths = (data: string[]) => {
//   let fullpaths: string[] = [];

//   data.map((item: string) => {
//     if(item){
//       const start = findCharIndex(item, '/', 3) + 1;
//       const sliced = item.slice(start);
//       fullpaths = [...fullpaths, sliced];
//     }
//   });

//   return fullpaths;
// };
