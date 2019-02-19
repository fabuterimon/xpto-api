"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const produto_model_1 = require("./produto.model");
class ProdutosRouter extends model_router_1.ModelRouter {
    constructor() {
        super(produto_model_1.Produtos);
    }
    // update = (req, resp, next)=>{
    //   const options = {runValidators: true, new : true}
    //   this.model.findByIdAdUpdate(req.params.id, req.body, options)
    //       .then(this.render(resp, next))
    //       .catch(next)
    // }
    //`${this.novoProduto}`
    //{nome:'Panela de Vapor'}
    applyRoutes(application) {
        application.get('/produtos', this.findAll);
        application.get('/produtos/:id', [this.validateId, this.findById]);
        application.post('/produtos', this.save);
        application.put('/produtos/:id', this.replace);
        //application.patch('/produtos/:id', this.update)
        // application.patch('/produtos/', this.updateOne)
        application.del('/produtos/:id', this.delete);
        //  this.updateName(this.idProcura, this.novoProduto)
    }
}
exports.produtosRouter = new ProdutosRouter();
