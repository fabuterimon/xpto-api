"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const restify_errors_1 = require("restify-errors");
const vendas_model_1 = require("./vendas.model");
class VendasRouter extends model_router_1.ModelRouter {
    constructor() {
        super(vendas_model_1.Vendas);
        this.findProdutos = (req, resp, next) => {
            vendas_model_1.Vendas.findById(req.params.id, "+produtos")
                .then(vendas => {
                if (!vendas) {
                    throw new restify_errors_1.NotFoundError('Vendas not found');
                }
                else {
                    resp.json(vendas.produtos);
                    return next();
                }
            }).catch(next);
        };
        this.adicionaProdutos = (req, resp, next) => {
            vendas_model_1.Vendas.findById(req.params.id, "+produtos").then(vendas => {
                if (!vendas) {
                    throw new restify_errors_1.NotFoundError('Vendas not found');
                }
                else {
                    console.log(`${vendas.produtos}`);
                    //vendas.produtos = req.body
                    vendas.produtos.push(req.body);
                    console.log(`${vendas.produtos}`);
                    vendas.save()
                        .then(this.render(resp, next))
                        .catch(next);
                }
            });
        };
    }
    prepareOne(query) {
        return query.populate('produto').populate('empresa');
    }
    // protected prepareOne(query: mongoose.DocumentQuery<Vendas, Vendas>): mongoose.DocumentQuery<Vendas, Vendas> {
    //   return query.populate('empresa', 'nome')
    //     .populate('empresa', 'nome')
    //     .populate('empresa', 'cnpj')
    //     .populate('empresa', 'ativo')
    //     .populate('produto', 'name')
    //     .populate('produto', 'preco')
    // }
    // findById = (req, resp, next) => {
    //   this.model.findById(req.params.id)
    //     .populate('empresa')
    //     .populate('produto')
    //         .then(this.render(resp, next))
    //         .catch(next)
    //   }
    applyRoutes(application) {
        application.get('/vendas', this.findAll);
        application.get('/vendas/:id', [this.validateId, this.findById]);
        application.post('/vendas', this.save);
        application.get('/vendas/:id/produtos', this.findProdutos);
        application.put('/vendas/:id/produtos', this.adicionaProdutos);
    }
}
exports.vendasRouter = new VendasRouter();
