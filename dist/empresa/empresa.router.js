"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const empresa_model_1 = require("./empresa.model");
class EmpresasRouter extends model_router_1.ModelRouter {
    constructor() {
        super(empresa_model_1.Empresas);
    }
    applyRoutes(application) {
        application.get('/empresas', this.findAll); //Listar
        application.get('/empresas/:id', [this.validateId, this.findById]); //Listar por ID
        application.post('/empresas', this.save); //Adicionar
        application.put('/empresas/:id', [this.validateId, this.replace]); //Substituir
        application.patch('/empresas/:id', [this.validateId, this.update]); //Modificar
        application.del('/empresas/:id', [this.validateId, this.delete]); //Apagar 
    }
}
exports.empresasRouter = new EmpresasRouter();
