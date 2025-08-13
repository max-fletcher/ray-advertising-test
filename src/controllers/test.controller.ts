// import { Request, Response } from 'express';
// import {
//   multipleFileLocalFullPathResolver,
//   rollbackMultipleFileLocalUpload,
// } from '../middleware/fileUploadLocal.middleware';
// import { BadRequestException } from '../errors/BadRequestException.error';
// import { TestService } from '../services/tests.services';
// import { CustomException } from '../errors/CustomException.error';
// import { deleteMultipleFilesS3, extractS3Fullpaths, rollbackMultipleFileS3 } from '../middleware/fileUploadS3.middleware';

// const testService = new TestService();

// export async function fileUploadTest(req: Request, res: Response) {
//   try {
//     // throw new BadRequestException('Bad request exception thrown') // Will run "rollbackMultipleFileLocalUpload" and delete files automatically

//     if (req.body.file_upload_status)
//       throw new BadRequestException(req.body.file_upload_status);

//     // fullPathSingleResolver JUST RETURN A STRING BASED ON WHAT IS IN req.body.file
//     const fullPath = multipleFileLocalFullPathResolver(req);
//     const images =
//       fullPath && Object.keys(fullPath!).length
//         ? [...fullPath!.images1, ...fullPath!.images2]
//         : null;

//     await testService.createUserWithImages(
//       req.body.username,
//       req.body.email,
//       req.body.password,
//       req.body.phone,
//       images!,
//     );

//     res.status(201).json({
//       message: 'Success. Check the public/{folderName} to view uploaded file.',
//     });
//   } catch (e: any) {
//     await rollbackMultipleFileLocalUpload(req);

//     if (e instanceof CustomException) {
//       return res
//         .status(e.statusCode)
//         .json({ message: e.message, code: e.statusCode });
//     }

//     return res
//       .status(500)
//       .json({ message: 'Something went wrong! Please try again.', code: 500 });
//   }
// }

// export const fileDeleteTest = async (req: Request, res: Response) => {
//   try {
//     if (!req?.params?.id) throw new BadRequestException('User ID required');

//     const result = await testService.deleteUserWithImages(req, req.params.id);

//     res.status(result.statusCode).json(result);
//   } catch (e: any) {
//     if (e instanceof CustomException) {
//       return res
//         .status(e.statusCode)
//         .json({ message: e.message, code: e.statusCode });
//     }

//     return res
//       .status(500)
//       .json({ message: 'Something went wrong! Please try again.', code: 500 });
//   }
// };

// export async function fileUploadS3Test(req: Request, res: Response) {
//   try {
//     // throw new BadRequestException('Bad request exception thrown') // Will run "rollbackMultipleFileLocalUpload" and delete files automatically

//     if (req.body.file_upload_status)
//       throw new BadRequestException(req.body.file_upload_status);

//     res.status(201).json({
//       message: 'Success. Check the public/{folderName} to view uploaded file.',
//       data: req.files
//     });
//   } catch (e: any) {
//     await rollbackMultipleFileS3(req)

//     if (e instanceof CustomException) {
//       return res
//         .status(e.statusCode)
//         .json({ message: e.message, code: e.statusCode });
//     }

//     return res
//       .status(500)
//       .json({ message: 'Something went wrong! Please try again.', code: 500 });
//   }
// }

// export async function fileDeleteS3Test(req: Request, res: Response) {
//   try {
//     await deleteMultipleFilesS3(req.body.delete_files);

//     res.status(201).json({
//       message: 'Success. Check the public/{folderName} to confirm deleteion file.',
//       request: req.body,
//       files: req.files,
//       file: req.file
//     });
//   } catch (e: any) {
//     if (e instanceof CustomException) {
//       return res
//         .status(e.statusCode)
//         .json({ message: e.message, code: e.statusCode });
//     }

//     return res
//       .status(500)
//       .json({ message: 'Something went wrong! Please try again.', code: 500 });
//   }
// }

// export async function fileDeleteFullpathsS3Test(req: Request, res: Response) {
//   try {
//     const paths = extractS3Fullpaths(req.body.fullpaths);
//     await deleteMultipleFilesS3(paths);

//     res.status(201).json({
//       message: 'Success.',
//       paths: paths
//     });
//   } catch (e: any) {
//     if (e instanceof CustomException) {
//       return res
//         .status(e.statusCode)
//         .json({ message: e.message, code: e.statusCode });
//     }

//     return res
//       .status(500)
//       .json({ message: 'Something went wrong! Please try again.', code: 500 });
//   }
// }