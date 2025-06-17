import fs from 'fs';
import path from 'path';

const pathsDir = path.resolve(__dirname, '../../swagger/path');
const schemasDir = path.resolve(__dirname, '../../swagger/schemas');

// 🔹 Ler arquivos de paths
const pathFiles = fs.readdirSync(pathsDir);
const paths = pathFiles.reduce((acc, file) => {
    if (file.endsWith('.json')) {
        const filePath = path.join(pathsDir, file);
        const content = require(filePath);

        Object.assign(acc, content);
    }
    return acc;
}, {} as Record<string, any>);

// 🔸 Ler arquivos de schemas
const schemaFiles = fs.readdirSync(schemasDir);
const schemas = schemaFiles.reduce((acc, file) => {
    if (file.endsWith('.json')) {
        const filePath = path.join(schemasDir, file);
        const content = require(filePath);

        Object.assign(acc, content);
    }
    return acc;
}, {} as Record<string, any>);

// 🚀 Swagger Config
export const swaggerConfig = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API documentation for the Express + MongoDB + TypeScript application',
    },
    paths,
    components: {
        schemas,
        responses: {},
        parameters: {},
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
    tags: [],
};
