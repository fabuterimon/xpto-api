"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const empresa_model_1 = require("./empresa.model");
class EmpresasRouter extends model_router_1.ModelRouter {
    constructor() {
        super(empresa_model_1.Empresas);
    }
    applyRoutes(application) {
        application.get('/empresas', this.findAll);
        application.get('/empresas/:id', [this.validateId, this.findById]);
        application.post('/empresas', this.save);
        application.put('/empresas/:id', this.replace);
        application.patch('/empresas/:id', this.update);
        application.del('/empresas/:id', this.delete);
    }
}
exports.empresasRouter = new EmpresasRouter();
