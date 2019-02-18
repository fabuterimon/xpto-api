"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const vendas_model_1 = require("./vendas.model");
class VendasRouter extends model_router_1.ModelRouter {
    constructor() {
        super(vendas_model_1.Vendas);
    }
    applyRoutes(application) {
        application.get('/vendas', this.findAll);
        application.get('/vendas/:id', [this.validateId, this.findById]);
        application.post('/vendas', this.save);
    }
}
exports.vendasRouter = new VendasRouter();
