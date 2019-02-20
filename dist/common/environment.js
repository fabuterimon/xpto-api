"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    //Possibilidade de definar a porta no environment
    server: { port: process.env.SERVER_PORT || 3000 },
    db: { url: process.env.DB_URL || 'mongodb://localhost/xpto-api' },
};
