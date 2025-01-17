export type LogLevel = 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug';

export interface IConfig {
    env: string;
    mongo: {
        url: string;
        useCreateIndex: boolean;
        autoIndex: boolean;
        debug: boolean;
    };
    server: {
        cors: {
            origin: boolean;
            credentials: boolean;
        };
        root: string;
        port: number;
        host: string;
        logLevel: LogLevel;
        axiosTimeout: number;
        memoryUsageTimeOut: number;
    };
    caching: {
        local: {
            ttl: number;
        };
    };
}
