import { ICommonControllerInterface, ICommonRepositoryInterface, ICommonServiceInterface, IMockCommonRepositoryInterface, IMockCommonServiceInterface } from "./common.interface";

export interface IAppUserControllerInterface extends ICommonControllerInterface {};

export interface IAppUserServiceInterface extends ICommonServiceInterface {};

export interface IAppUserRepositoryInterface extends ICommonRepositoryInterface {};

export interface IMockAppUserServiceInterface extends IMockCommonServiceInterface {};

export interface IMockAppUserRepositoryInterface extends IMockCommonRepositoryInterface {};