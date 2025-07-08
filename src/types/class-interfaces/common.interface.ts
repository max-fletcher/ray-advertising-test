import { Response } from "express";
import { Transaction } from "sequelize";
import { TMockPaginationResult, TPaginationResult } from "../types/common.type";
import { TAppUser, TAppUserWithTimestamps, TStoreAppUser, TStoreAppUserData, TUpdateAppUserData } from "../types/app.user.type";
import { AppUserModel } from "../../db/rdb/models";

export type SuccessResponse = {
    message: string,
    statusCode: number,
    data: any,
}

export type ErrorResponse = {
    message: string,
    statusCode: number,
}

// Middleware doesn't work when controller is a class. Need to see this later.
export interface ICommonControllerInterface {
    getPaginated(): Response<SuccessResponse|ErrorResponse>,
    getAll(): Response<SuccessResponse|ErrorResponse>,
    findById(id: string): Response<SuccessResponse|ErrorResponse>,
    existsById(id: string): any,
    findByIds(ids: string[]): any,
    create(data: any, transaction?: Transaction): Response<SuccessResponse|ErrorResponse>,
    update(data: any, id: string, transaction?: Transaction): Response<SuccessResponse|ErrorResponse>,
    delete(id: string, transaction?: Transaction): Response<SuccessResponse|ErrorResponse>,
    hardDeleteById(id: string, transaction?: Transaction): Response<SuccessResponse|ErrorResponse>,
};

// For use with Postgres.
export interface ICommonServiceInterface {
    getPaginated(page: number, limit: number, sortOrder: string, sortBy: string, searchText: string|null): Promise<TPaginationResult<AppUserModel>>,
    getAll(select: string[]|null): Promise<TAppUser[]>,
    findById(id: string): Promise<TAppUser>,
    existsById(id: string): Promise<number>,
    findByIds(ids: string[]): Promise<TAppUser[]>,
    create(data: TStoreAppUserData, transaction?: Transaction): Promise<TAppUser>,
    update(data: TUpdateAppUserData, id: string, transaction?: Transaction): Promise<TAppUser>,
    delete(id: string, transaction?: Transaction): Promise<TAppUser>,
    hardDeleteById(id: string, transaction?: Transaction): Promise<TAppUser>,
};

export interface ICommonRepositoryInterface {
    getPaginated(page: number, limit: number, sortOrder: string, sortBy: string, searchText: string|null): Promise<TPaginationResult<AppUserModel>>,
    getAll(select: string[]|null): Promise<TAppUser[]>,
    findById(id: string): Promise<TAppUser>,
    existsById(id: string): Promise<number>,
    findByIds(ids: string[]): Promise<TAppUser[]>,
    create(data: TStoreAppUser, transaction?: Transaction): Promise<TAppUser>,
    update(data: TUpdateAppUserData, id: string, transaction?: Transaction): Promise<TAppUser>,
    delete(id: string, transaction?: Transaction): Promise<TAppUser>,
    hardDeleteById(id: string, transaction?: Transaction): Promise<TAppUser>,
};

// For use with mock database/in-memory object.
export interface IMockCommonServiceInterface {
    getPaginated(page: number, limit: number): Promise<TMockPaginationResult>,
    getAll(): Promise<TAppUserWithTimestamps[]>,
    findById(id: string): Promise<TAppUserWithTimestamps>,
    existsById(id: string): Promise<boolean>,
    create(data: Omit<TAppUserWithTimestamps, 'id'|'deletedAt'|'deletedBy'|'avatarUrl'|'createdAt'|'updatedAt' >, transaction?: Transaction): Promise<TAppUserWithTimestamps>,
    update(data: TAppUserWithTimestamps, id: string, transaction?: Transaction): Promise<TAppUserWithTimestamps>,
    delete(id: string, transaction?: Transaction): Promise<TAppUserWithTimestamps>,
};

export interface IMockCommonRepositoryInterface {
    getPaginated(page: number, limit: number): Promise<TMockPaginationResult>,
    getAll(): Promise<TAppUserWithTimestamps[]>,
    findById(id: string): Promise<TAppUserWithTimestamps>,
    existsById(id: string): Promise<boolean>,
    create(data: TAppUserWithTimestamps, transaction?: Transaction): Promise<TAppUserWithTimestamps>,
    update(data: TAppUserWithTimestamps, id: string, transaction?: Transaction): Promise<TAppUserWithTimestamps>,
    delete(id: string, transaction?: Transaction): Promise<TAppUserWithTimestamps>,
};