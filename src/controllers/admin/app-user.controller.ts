import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AppUserService } from '../../services/app-user.services';
import { IAuthenticatedRequest } from '../../types/interfaces/authenticate.interface';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { ErrorResponse, SuccessResponse } from '../../types/class-interfaces/common.interface';

const appUserService = new AppUserService();

/**
 * Get all data.
 * @param req Express request extended with params, query strings, user(for when using JWT auth) and files(when using multer)
 * @param res Express response
 * @returns A promise that resolves into an express response with formatted data(either of type SuccessResponse or ErrorResponse).
 */
export async function getAllAppUser(req: IAuthenticatedRequest, res: Response) : Promise<Response<SuccessResponse|ErrorResponse>> {
  try {
    // Get all params for data fetching
    const page = req.query.page ? Number(req.query.page) : null
    const limit = req.query.limit ? Number(req.query.limit) : null
    const sortOrder = req.query.sortOrder ? req.query.sortOrder.toString() : 'ASC'
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    const searchText = req.query.searchText && req.query.searchText !== '' ? req.query.searchText.toString() : null

    if(sortOrder && sortOrder !== 'ASC' && sortOrder !== 'DESC')
      throw new BadRequestException('Sort order has to be ASC or DESC')

    // If limit and offset exists, get paginated data, else get all data
    let appUsers = null
    if(page && limit)
      appUsers = await appUserService.getPaginated(page, limit, sortOrder, sortBy, searchText);
    else
      appUsers = await appUserService.getAll();

    return res.status(200).json({
      message: 'App user list fetched successfully!',
      statusCode: 200,
      data: appUsers,
    });
  } catch (error) {
    console.log('getAllAppUser', error)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      message: 'Something went wrong! Please try again.',
      statusCode: 500,
    });
  }
}

/**
 * Get Single data.
 * @param req Express request extended with params, query strings, user(for when using JWT auth) and files(when using multer)
 * @param res Express response
 * @returns A promise that resolves into an express response with formatted data(either of type SuccessResponse or ErrorResponse).
 */
export async function getSingleAppUser(req: IAuthenticatedRequest, res: Response) : Promise<Response<SuccessResponse|ErrorResponse>> {
  try {
    // Get id from params and find data
    const appUserId = req.params.id
    const appUser = await appUserService.findById(appUserId, null);

    // Throw exception if data doesn't exist
    if(!appUser)
      throw new NotFoundException('App user not found.')
    if(appUser.deletedAt)
      throw new NotFoundException('App user not found.')

    return res.status(200).json({
      message: 'App user fetched successfully!',
      statusCode: 200,
      data: appUser,
    });
  } catch (error) {
    console.log('getSingleAllAppUser', error)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      message: 'Something went wrong! Please try again.',
      statusCode: 500,
    });
  }
}

/**
 * Create data.
 * @param req Express request extended with params, query strings, user(for when using JWT auth) and files(when using multer)
 * @param res Express response
 * @returns A promise that resolves into an express response with formatted data(either of type SuccessResponse or ErrorResponse).
 */
export async function createAppUser(req: IAuthenticatedRequest, res: Response) : Promise<Response<SuccessResponse|ErrorResponse>> {
  try {
    // Extract data from body and create new data
    const data = { ...req.body }
    const response = await appUserService.create(data);

    if(response)
      return res.status(201).json({
        message: 'App user created successfully!',
        statusCode: 201,
        data: response,
      });

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    console.log('createAppUser', error)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      message: 'Something went wrong! Please try again.',
      statusCode: 500,
    });
  }
}

/**
 * Update data.
 * @param req Express request extended with params, query strings, user(for when using JWT auth) and files(when using multer)
 * @param res Express response
 * @returns A promise that resolves into an express response with formatted data(either of type SuccessResponse or ErrorResponse).
 */
export async function updateAppUser(req: IAuthenticatedRequest, res: Response) : Promise<Response<SuccessResponse|ErrorResponse>> {
  try {
    // Get id from params, and check if the record exists
    const appUserId = req.params.id
    const appUser = await appUserService.findById(appUserId, ['id', 'deletedAt'])
    if(!appUser)
      throw new NotFoundException('App user not found.')
    if(appUser.deletedAt)
      throw new NotFoundException('App user not found.')

    // Extract data from body and update data
    const data = { ...req.body }
    const response = await appUserService.update(data, appUserId);

    if(response){
      // Get updated data
      const appUser = await appUserService.findById(appUserId);
      return res.json({
        message: 'App user updated successfully!',
        statusCode: 200,
        data: appUser,
      });
    }

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    console.log('updateAppUser', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      message: 'Something went wrong! Please try again.',
      statusCode: 500,
    });
  }
}

/**
 * Soft delete data.
 * @param req Express request extended with params, query strings, user(for when using JWT auth) and files(when using multer)
 * @param res Express response
 * @returns A promise that resolves into an express response with formatted data(either of type SuccessResponse or ErrorResponse).
 */
export async function deleteAppUser(req: IAuthenticatedRequest, res: Response) : Promise<Response<SuccessResponse|ErrorResponse>> {
  try {
    // Get id from params, and check if the record exists
    const appUserId = req.params.id
    const appUser = await appUserService.findById(appUserId)
    if(!appUser)
      throw new NotFoundException('App user not found.')
    if(appUser.deletedAt)
      throw new NotFoundException('App user not found.')

    // Delete data
    const response = await appUserService.delete(appUserId);

    if(response){
      return res.json({
        message: 'App user deleted successfully!',
        statusCode: 200,
        data: appUser,
      });
    }

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    console.log('deleteAppUser', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      message: 'Something went wrong! Please try again.',
      statusCode: 500,
    });
  }
}