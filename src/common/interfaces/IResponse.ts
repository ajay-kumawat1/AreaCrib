import { ILooseObject } from './ILooseObject';

export interface IResponse {
    data?: ILooseObject;
    message?: string;
    success: boolean;
}