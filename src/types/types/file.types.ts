export type fieldType =
  | {
      name: string;
      maxCount: number;
    }[]
  | [];

export type fieldsType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export type formattedPathsType = {
  [key: string]: string[];
};

export type s3FieldsType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: string | null;
  contentEncoding: string | null;
  storageClass: string;
  serverSideEncryption: string | null;
  metadata: { fieldname: string | null };
  location: string;
  etag: string;
  versionId?: string;
};

export type s3FilePaths = {
  Key: string;
};
