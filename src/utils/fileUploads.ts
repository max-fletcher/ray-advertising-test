import fs from 'fs';
import multer from 'multer';
import path from 'path';

type destinationCallback = (data1: null, data2: string) => void;
type fileFilterCallback = (data1: null, data2: boolean) => void;

// WHERE THE FILE SHOULD BE STORED
const destination = (
  req: any,
  file: any,
  cb: destinationCallback,
  fieldBasedDestination: boolean,
) => {
  let dir = './src/public/uploads';
  if (fieldBasedDestination) {
    dir += '/' + file.fieldname.split('[')[0];
  }
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  cb(null, dir.substring(dir.indexOf('/') + 1)); // Specify the destination directory
};

// LOGIC FOR SETTING THE FILENAME USED TO STORE THE FILE
const filename = (req: any, file: any, cb: destinationCallback) => {
  const fileExt = path.extname(file.originalname);
  const fileName =
    file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') +
    '-' +
    Date.now() +
    fileExt;

  cb(null, fileName); // Use the original filename
};

const fileFilter = (req: any, file: any, cb: fileFilterCallback) => {
  cb(null, true);
};

export const fileUploads = ({
  fieldBasedDestination = true,
  maxSize,
}: {
  fieldBasedDestination?: boolean;
  acceptedTypes?: string[];
  maxSize: number;
}) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) =>
        destination(req, file, cb, fieldBasedDestination),
      filename,
    }),
    limits: {
      fileSize: maxSize * 1024 * 1024, // Limit file size
    },
    fileFilter,
  });

  return upload;
};

export const deleteSingleFile = (file: any) => {
  if (file.destination && file.filename) {
    const filePath = file.destination + '/' + file.filename;
    deleteLocalFile(filePath);
  }
};

// Function to delete uploaded files
export const deleteUploadedFiles = (files: any) => {
  Object.values(files ?? {}).forEach((fileList: any) => {
    fileList.forEach((file: any) => {
      deleteSingleFile(file);
    });
  });
};

// Delete Local Single Files
export const deleteLocalFile = (filePath: string | undefined) => {
  console.log(filePath);
  if (filePath?.startsWith('http')) {
    filePath =
      'src/public/' + filePath.substring(filePath.indexOf('/uploads') + 1);
  }
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// file-path resolver
export const resolveFilePath = (file: any) => {
  const domain = process.env.FILE_BASE_URL;
  const filePath = file.fieldname + '/' + file.filename;
  return `${domain}/${filePath}`;
};
