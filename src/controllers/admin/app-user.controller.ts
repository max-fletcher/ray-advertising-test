import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AppUserService } from '../../services/app-user.services';
import { IAuthenticatedRequest } from '../../types/interfaces/authenticate.interface';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { NotFoundException } from '../../errors/NotFoundException.error';

const appUserService = new AppUserService();

export async function getAllAppUser(req: IAuthenticatedRequest, res: Response) {
  try {
    const page = req.query.page ? Number(req.query.page) : null
    const limit = req.query.limit ? Number(req.query.limit) : null
    const sortOrder = req.query.sortOrder ? req.query.sortOrder.toString() : 'ASC'
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    const searchText = req.query.searchText && req.query.searchText !== '' ? req.query.searchText.toString() : null

    if(sortOrder && sortOrder !== 'ASC' && sortOrder !== 'DESC')
      throw new BadRequestException('Sort order has to be ASC or DESC')

    let appUsers = null
    if(page && limit)
      appUsers = await appUserService.getPaginated(page, limit, sortOrder, sortBy, searchText);
    else
      appUsers = await appUserService.getAll();

    return res.status(200).json({
      message: 'App user list fetched successfully!',
      data: appUsers,
      statusCode: 200,
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

export async function getSingleAppUser(req: IAuthenticatedRequest, res: Response) {
  try {
    const appUserId = req.params.id
    const appUser = await appUserService.findById(appUserId, null);

    if(!appUser)
      throw new NotFoundException('App user not found.')
    if(appUser.deletedAt)
      throw new NotFoundException('App user not found.')

    return res.status(200).json({
      message: 'App user fetched successfully!',
      data: appUser,
      statusCode: 200,
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

export async function createAppUser(req: IAuthenticatedRequest, res: Response) {
  try {
    const data = { ...req.body }
    const response = await appUserService.create(data);

    if(response)
      return res.status(201).json({
        message: 'App user created successfully!',
        data: response,
        statusCode: 201,
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

export async function updateAppUser(req: IAuthenticatedRequest, res: Response) {
  try {
    const appUserId = req.params.id
    const appUser = await appUserService.findById(appUserId, ['id', 'deletedAt'])
    if(!appUser)
      throw new NotFoundException('App user not found.')
    if(appUser.deletedAt)
      throw new NotFoundException('App user not found.')

    const data = { ...req.body }

    const response = await appUserService.update(data, appUserId);

    if(response){
      const appUser = await appUserService.findById(appUserId);
      return res.json({
        message: 'App user updated successfully!',
        data: appUser,
        statusCode: 200,
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

export async function deleteAppUser(req: IAuthenticatedRequest, res: Response) {
  try {
    const appUserId = req.params.id

    const appUser = await appUserService.findById(appUserId)
    if(!appUser)
      throw new NotFoundException('App user not found.')
    if(appUser.deletedAt)
      throw new NotFoundException('App user not found.')

    const response = await appUserService.delete(appUserId);

    if(response){
      return res.json({
        message: 'App user deleted successfully!',
        data: appUser,
        statusCode: 200,
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