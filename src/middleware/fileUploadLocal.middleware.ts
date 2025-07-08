// IMPORT MULTER FOR FILE UPLOAD
import { Request } from 'express';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { fieldsType, fieldType, formattedPathsType } from '../types/types/file.types';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// FILEFIELDNAME(required), DEFAULT PATH = 'temp' & DEFAULT MAXSIZE = 30 MB
export const multipleFileLocalUploader = (
  fileFieldName: fieldType,
  path = 'temp',
  maxSize = 31457280,
) => {
  if (fileFieldName.length === 0) {
    const upload = multer();
    return upload.none();
  }

  const storage = multer.diskStorage({
    // WHERE THE FILE SHOULD BE STORED
    destination: function (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback,
    ) {
      const dir = './src/public/uploads/' + path;

      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      cb(null, dir);
    },
    // LOGIC FOR SETTING THE FILENAME USED TO STORE THE FILE
    filename: function (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback,
    ) {
      const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
      const filename =
        Date.now() +
        randomNum +
        '-' +
        file.originalname.trim().replaceAll(' ', '_');

      cb(null, filename);
    },
  });

  // LOGIC FOR IF THE FILE SHOULD BE ALLOWED TO BE UPLOADED OR NOT
  const additionalValidation = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const fileSize = parseInt(req.headers['content-length']!);
    if (fileSize > maxSize) {
      req.body.file_upload_status = 'File too big to be uploaded to server';
      return cb(null, false);
    }

    return cb(null, true);
  };

  // RETURN MULTER INSTANCE WITH NECESSARY OPTIONS
  return multer({
    storage: storage,
    fileFilter: additionalValidation,
  }).fields(fileFieldName);
};

export const rollbackMultipleFileLocalUpload = async (req: Request) => {
  if (!req.files || !Object.keys(req.files).length) return;

  // IF EXISTS/NOT EMPTY CHECK
  Object.values(req.files!).forEach(async (fields: fieldsType[]) => {
    // IF EXISTS/NOT EMPTY CHECK
    fields.map(async (field: fieldsType) => {
      const directoryPath =
        'src/' +
        field.path.substring(
          field.path.indexOf('\\') + 1,
          field.path.lastIndexOf('\\'),
        ) +
        '/' +
        field.filename;

      // IF EXISTS/NOT EMPTY CHECK. DUNNO WHAT TO DO WITH THIS...
      if (field && fs.existsSync(directoryPath)) {
        await fs.unlinkSync(directoryPath);
      }
    });
  });

  return;
};

export const deleteMultipleFileLocal = async (
  req: Request,
  filePaths?: string[] | null,
) => {
  if (!filePaths) return;

  filePaths.map(async (filePath) => {
    const tempFilePath =
      'src/public/' +
      filePath.replace(
        (!process.env.FILE_BASE_URL || process.env.FILE_BASE_URL === ''
          ? req.protocol + '://' + req.get('host')
          : process.env.FILE_BASE_URL) + '/',
        '',
      );
    // console.log('tempFilePath', tempFilePath);
    if (fs.existsSync(tempFilePath)) await fs.unlinkSync(tempFilePath);
  });

  return;
};

export const multipleFileLocalFullPathResolver = (req: Request) => {
  if (!req.files || !Object.keys(req.files).length) return;

  const formatted_paths: formattedPathsType = {};

  Object.entries(req.files).forEach(([fieldName, files]) => {
    const paths = (files as Express.Multer.File[]).map((file) => {
      // Make file path relative to `src/public` (no manual "uploads/")
      const relativePath = path.relative(
        path.resolve('src/public'),
        file.path
      );

      const publicUrl =
        process.env.FILE_BASE_URL && process.env.FILE_BASE_URL !== ''
          ? process.env.FILE_BASE_URL
          : `${req.protocol}://${req.get('host')}`;

      return `${publicUrl}/${relativePath.replace(/\\/g, '/')}`;
    });

    formatted_paths[fieldName] = paths;
  });

  return formatted_paths;
};
