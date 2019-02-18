"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const produto_model_1 = require("./produto.model");
class ProdutosRouter extends model_router_1.ModelRouter {
    constructor() {
        super(produto_model_1.Produtos);
    }
    applyRoutes(application) {
        application.get('/produtos', this.findAll);
        application.get('/produtos/:id', [this.validateId, this.findById]);
        application.post('/produtos', this.save);
        application.put('/produtos/:id', this.replace);
        application.patch('/produtos/:id', this.update);
        application.del('/produtos/:id', this.delete);
    }
}
exports.produtosRouter = new ProdutosRouter();
