import { sign } from 'jsonwebtoken';
import config from '../config/config';

export async function signToken(info: Record<string, unknown>): Promise<string> {
    const newToken = sign(info, config.token.secret);

    return newToken;
}