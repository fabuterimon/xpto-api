"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const restify_errors_1 = require("restify-errors");
const vendas_model_1 = require("./vendas.model");
const empresa_model_1 = require("../empresa/empresa.model");
const mongodb_1 = require("mongodb");
class VendasRouter extends model_router_1.ModelRouter {
    constructor() {
        super(vendas_model_1.Vendas);
        this.findProdutos = (req, resp, next) => {
            vendas_model_1.Vendas.findById(req.params.id, "+produtos.produto")
                .then(vendas => {
                if (!vendas) {
                    console.log(`${req.body}`);
                    throw new restify_errors_1.NotFoundError('Vendas not found');
                }
                else {
                    var soma = 0;
                    var quantidade = 0;
                    var desconto = 0;
                    //vendas.empresa.id
                    empresa_model_1.Empresas.findById({ "vendas.empresa": mongodb_1.ObjectId }).then(emp => {
                        desconto = emp.perc_desconto;
                        // console.log(`${emp.perc_desconto}`)
                        console.log(`${desconto}`);
                    });
                    // vendas.produtos.forEach(item => {
                    //   Produtos.findById(item._id).then(prod => {
                    //     prod.quant_estoque = prod.quant_estoque - item.quantidade
                    //     console.log(`Item.Quantidade: ${desconto}`)
                    //   })
                    //   soma = soma + item.quantidade
                    //
                    // })
                    //
                    // this.updateQuantidade(req.params.id, soma)
                    // var valor_desconto = (soma - (soma * desconto))
                    //
                    // console.log(`Soma dos Produtos: ${soma}`)
                    // console.log(`${desconto}`)
                    // console.log(`${valor_desconto}`)
                    //
                    // this.updateDesconto(req.params.id, valor_desconto)
                }
                resp.json(vendas.valor_total);
                return next();
            }).catch(next);
        };
        this.updateQuantidade = (idProcura, valor) => {
            this.model.findOneAndUpdate({ _id: idProcura }, { valor_total: valor }, { runValidators: true, new: true }).then((data) => {
                if (data === null) {
                    throw new Error('Cat Not Found');
                }
                // resp.json({ message: 'Cat updated!' })
                //console.log(valor)
                //console.log("New cat data", data);
                return 0;
            }).catch((error) => {
                /*
                    Deal with all your errors here with your preferred error handle middleware / method
                 */
                // resp.status(500).json({ message: 'Some Error!' })
                console.log(error);
            });
        };
        this.updateDesconto = (idProcura, valor) => {
            this.model.findOneAndUpdate({ _id: idProcura }, { valor_desconto: valor }, { runValidators: true, new: true }).then((data) => {
                if (data === null) {
                    throw new Error('Cat Not Found');
                }
                // resp.json({ message: 'Cat updated!' })
                // console.log(valor)
                // console.log("New cat data", data);
                return 0;
            }).catch((error) => {
                /*
                    Deal with all your errors here with your preferred error handle middleware / method
                 */
                // resp.status(500).json({ message: 'Some Error!' })
                console.log(error);
            });
        };
        this.adicionaProdutos = (req, resp, next) => {
            vendas_model_1.Vendas.findById(req.params.id).then(vendas => {
                if (!vendas) {
                    throw new restify_errors_1.NotFoundError('Vendas not found');
                }
                else {
                    vendas.produtos.push(req.body);
                    var soma = 0;
                    console.log(`${vendas.produtos}`);
                    vendas.produtos.forEach(item => {
                        // soma = soma + item.quantidade
                        console.log(`${item}`);
                    });
                    console.log(`${vendas.produtos}`);
                    vendas.save()
                        .then(this.render(resp, next))
                        .catch(next);
                }
            });
        };
        this.findAll = (req, resp, next) => {
            this.model.find()
                .populate('empresa')
                .populate('produtos.produto')
                .then(this.renderAll(resp, next))
                .catch(next);
        };
    }
    prepareOne(query) {
        return query.populate('empresa').populate('produtos.produto');
    }
    applyRoutes(application) {
        application.get('/vendas', this.findAll);
        application.get('/vendas/:id', [this.validateId, this.findById]);
        application.post('/vendas', this.save);
        application.get('/vendas/:id/produtos', this.findProdutos);
        //  application.put('/vendas/:id/produtos', this.adicionaProdutos)
    }
}
exports.vendasRouter = new VendasRouter();
