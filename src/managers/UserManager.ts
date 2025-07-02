import { genSalt, hash } from 'bcryptjs';
import gravatar from 'gravatar';
import config from '../config/config';

export default class UserManager {
    public static async generatePasswordAndAvatar(
        email: string,
        password?: string,
    ): Promise<{ avatar: string; generatedPassword: string; hashedPassword: string }> {
        const saltRounds = 10;
        const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
        const generatedPassword = password ?? config.password;
        const salt = await genSalt(saltRounds);

        return {
            avatar,
            generatedPassword,
            hashedPassword: await hash(generatedPassword.toString(), salt),
        };
    }
}
