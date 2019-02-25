"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const produto_model_1 = require("./produto.model");
class ProdutosRouter extends model_router_1.ModelRouter {
    constructor() {
        super(produto_model_1.Produtos);
    }
    applyRoutes(application) {
        application.get('/produtos', this.findAll); //Listar
        application.get('/produtos/:id', [this.validateId, this.findById]); //Listar por ID
        application.post('/produtos', this.save); //Adicionar
        application.put('/produtos/:id', [this.validateId, this.replace]); //Substituir
        application.patch('/produtos/:id', [this.validateId, this.update]); //Modificar
        application.del('/produtos/:id', [this.validateId, this.delete]); //Apagar
    }
}
exports.produtosRouter = new ProdutosRouter();
