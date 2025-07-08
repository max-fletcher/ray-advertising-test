import { Response } from "express";
import { Transaction } from "sequelize";

export type SuccessResponse = {
    message: string,
    statusCode: number,
    data: any,
}

export type ErrorResponse = {
    message: string,
    statusCode: number,
}

export interface ICommonControllerInterface {
    getAll(): Response<SuccessResponse|ErrorResponse>,
    getPaginated(): Response<SuccessResponse|ErrorResponse>,
    findById(id: string): Response<SuccessResponse|ErrorResponse>,
    existsById(id: string): any,
    findByIds(ids: string[]): any,
    create(data: any, transaction?: Transaction): Response<SuccessResponse|ErrorResponse>,
    update(data: any, id: string, transaction?: Transaction): Response<SuccessResponse|ErrorResponse>,
    delete(id: string, transaction?: Transaction): Response<SuccessResponse|ErrorResponse>,
    hardDeleteById(id: string, transaction?: Transaction): Response<SuccessResponse|ErrorResponse>,
};

export interface ICommonServiceInterface {
    getAll(select: string[]|null): any,
    getPaginated(page: number, limit: number, sortOrder: string, sortBy: string, searchText: string|null): any,
    findById(id: string): any,
    existsById(id: string): any,
    findByIds(ids: string[]): any,
    create(data: any, transaction?: Transaction): any,
    update(data: any, id: string, transaction?: Transaction): any,
    delete(id: string, transaction?: Transaction): any,
    hardDeleteById(id: string, transaction?: Transaction): any,
};

export interface ICommonRepositoryInterface {
    getAll(select: string[]|null): any,
    getPaginated(page: number, limit: number, sortOrder: string, sortBy: string, searchText: string|null): any,
    findById(id: string): any,
    existsById(id: string): any,
    findByIds(ids: string[]): any,
    create(data: any, transaction?: Transaction): any,
    update(data: any, id: string, transaction?: Transaction): any,
    delete(id: string, transaction?: Transaction): any,
    hardDeleteById(id: string, transaction?: Transaction): any,
};