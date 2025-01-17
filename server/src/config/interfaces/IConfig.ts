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
    };
}
