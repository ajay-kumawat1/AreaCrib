import path from 'path';

import { config as dotenvConfig } from 'dotenv';
import dotenvParseVariables from 'dotenv-parse-variables';
import { IConfig, LogLevel } from './interfaces/IConfig';

dotenvConfig({ path: '.env' });

const parsedEnv = dotenvParseVariables(process.env as Record<string, string>);

const ROOT = path.normalize(__dirname + '/..'); // Root path of server

const cors = {
    origin: false,
    credentials: true,
};

const mongoAppUrl = process.env.MONGO_URI;

const config: IConfig = {
    env: parsedEnv.CONF_ENV as string,
    mongo: {
        url: mongoAppUrl as string,
        useCreateIndex: parsedEnv.MONGO_CREATE_INDEX as boolean,
        autoIndex: parsedEnv.MONGO_AUTO_INDEX as boolean,
        debug: parsedEnv.MONGO_DEBUG as boolean,
    },
    server: {
        cors,
        root: ROOT,
        port: parsedEnv.PORT as number,
        host: parsedEnv.HOST as string,
        logLevel: parsedEnv.LOG_LEVEL as LogLevel,
        axiosTimeout: (parsedEnv.AXIOS_TIMEOUT as number) || 2400000,
        memoryUsageTimeOut: (parsedEnv.MEMORY_USAGE_TIMEOUT as number) || 300000,
    },
    caching: {
        local: {
            ttl: parsedEnv.LOCAL_CACHE_TTL as number,
        },
    },
};

export default config;
