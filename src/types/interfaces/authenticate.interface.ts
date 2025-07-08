import { Request } from 'express';
import { AppUserPayload } from '../../schema/token-payload.schema';
import { TAnyStringKeyValuePair } from '../types/common.type';

export interface IAuthenticatedRequest extends Request {
  query: TAnyStringKeyValuePair
  params: TAnyStringKeyValuePair
  user?: AppUserPayload;
  files?: any;
}
