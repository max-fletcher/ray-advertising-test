import { Request } from 'express';
import { AppUserPayload } from '../schema/token-payload.schema';
import { AnyStringKeyValuePair } from './app.user.type';

export interface AppAuthenticatedRequest extends Request {
  query: AnyStringKeyValuePair
  params: AnyStringKeyValuePair
  user?: AppUserPayload;
  files?: any;
}
