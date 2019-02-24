"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const error_handler_1 = require("./error.handler");
class Server {
    initializeDB() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url);
    }
    //
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                // criação do servidor
                this.application = restify.createServer({
                    name: 'xpto-api',
                    version: '1.0.0'
                });
                /* mostrar querys q estão escodidas */
                this.application.use(restify.plugins.queryParser());
                //transformar objeto buffer de objeto json em body
                this.application.use(restify.plugins.bodyParser());
                //routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
                this.application.on('restifyError', error_handler_1.handleError);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    //bootstrap recebe um arry de routers inicializado
    // vazio para caso ninguem passe nada para o bootstrap
    bootstrap(routers = []) {
        // return this.initRoutes(routers).then(() => this)
        return this.initializeDB().then(() => this.initRoutes(routers).then(() => this));
    }
}
exports.Server = Server;
