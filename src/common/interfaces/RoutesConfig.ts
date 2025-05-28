import express from 'express';
export abstract class RoutesConfig {
    public app: express.Application;
    public name: string;
    public path: string;
    public rootPath = '/api';

    public constructor(app: express.Application, path: string, name: string) {
        this.app = app;
        this.path = `${this.rootPath}/${path}`;
        this.name = name;
        this.configureRoutes();
    }
    public getName(): string {
        return this.name;
    }
    public abstract configureRoutes(): express.Application;
}
