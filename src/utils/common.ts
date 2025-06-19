import { sign } from 'jsonwebtoken';
import config from '../config/config';
import { ILooseObject } from '../common/interfaces/ILooseObject';
import { IResponse } from '../common/interfaces/IResponse';
import { Response } from 'express';

export async function signToken(info: Record<string, unknown>): Promise<string> {
    const newToken = sign(info, config.token.secret);

    return newToken;
}

export async function sendResponse(
    res: Response,
    data: ILooseObject,
    message: string | undefined,
    success: boolean,
    code = 200,
): Promise<void> {
    const responseObj: IResponse = {
        data: data,
        message: message ?? 'undefined',
        success: success,
    };

    res.status(code).json(responseObj);
}