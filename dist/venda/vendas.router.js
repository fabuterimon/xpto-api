"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const restify_errors_1 = require("restify-errors");
const vendas_model_1 = require("./vendas.model");
class VendasRouter extends model_router_1.ModelRouter {
    constructor() {
        super(vendas_model_1.Vendas);
        // findProdutos = (req, resp, next) => {
        //   Vendas.findById(req.params.id, "+produtos.produto")
        //     .then(vendas => {
        //       if (!vendas) {
        //         console.log(`${req.body}`)
        //         throw new NotFoundError('Vendas not found')
        //       } else {
        //         var soma = 0
        //         var quantidade = 0
        //         var valor_produto = 0
        //         var desconto = 0
        //
        //         /*
        //         Achar o Percentual de descontos da empresa cujo id está associado a Venda
        //         */
        //         Empresas.findById(vendas.empresa._id).then(emp => {
        //
        //           if (!emp) {
        //             console.log(`${req.body}`)
        //             throw new NotFoundError('Empresa not found')
        //           } else {
        //             desconto = emp.perc_desconto
        //             console.log(`1: ${desconto}`)
        //           }
        //           return next()
        //         })
        //
        //         /*
        //           Percorrer o vetor de Produtos para pegar a quantidade e multiplicar pelo preço
        //         */
        //         vendas.produtos.forEach(item => {
        //           if (!item) {
        //             console.log(`${req.body}`)
        //             throw new NotFoundError('Produtos not found')
        //           } else {
        //             Produtos.findById(item.produto._id).then(prod => {
        //               if (!prod) {
        //                 console.log(`2: ${req.body}`)
        //                 throw new NotFoundError('Produto Original not found')
        //               } else {
        //                 //prod.quant_estoque = prod.quant_estoque - item.quantidade
        //                 valor_produto = item.quantidade * prod.preco
        //                 console.log(`3: valor_produto: ${valor_produto}`)
        //               }
        //             })
        //             console.log(`4.0: soma: ${valor_produto}`)
        //             soma = soma + valor_produto
        //             console.log(`4.1: soma: ${soma}`)
        //           }
        //           return next()
        //         })
        //
        //         console.log(`5: Soma dos Produtos: ${soma}`)
        //         console.log(`6: ${desconto}`)
        //         // console.log(`${valor_desconto}`)
        //         //
        //         // this.updateQuantidade(req.params.id, soma)
        //         // var valor_desconto = (soma - (soma * desconto))
        //         //
        //         // console.log(`Soma dos Produtos: ${soma}`)
        //         // console.log(`${desconto}`)
        //         // console.log(`${valor_desconto}`)
        //         //
        //         // this.updateDesconto(req.params.id, valor_desconto)
        //       }
        //       resp.json(vendas)
        //       return next()
        //     }).catch(next)
        // }
        //
        // updateQuantidade = (idProcura, valor) => {
        //   this.model.findOneAndUpdate({ _id: idProcura }, { valor_total: valor }, { runValidators: true, new: true }).then((data) => {
        //     if (data === null) {
        //       throw new Error('Cat Not Found');
        //     }
        //     return 0
        //   }).catch((error) => {
        //     // resp.status(500).json({ message: 'Some Error!' })
        //     console.log(error);
        //   })
        // }
        //
        // updateDesconto = (idProcura, valor) => {
        //   this.model.findOneAndUpdate({ _id: idProcura }, { valor_desconto: valor }, { runValidators: true, new: true }).then((data) => {
        //     if (data === null) {
        //       throw new Error('Cat Not Found');
        //     }
        //     return 0
        //   }).catch((error) => {
        //     console.log(error);
        //   })
        // }
        this.adicionaProdutos = (req, resp, next) => {
            vendas_model_1.Vendas.findById(req.params.id).then(vendas => {
                if (!vendas) {
                    throw new restify_errors_1.NotFoundError('Vendas not found');
                }
                else {
                    vendas.produtos.push(req.body);
                    vendas.save()
                        .then(this.render(resp, next))
                        .catch(next);
                }
            });
        };
        this.findAll = (req, resp, next) => {
            this.model.find()
                .populate('empresa')
                .populate('produtos.produto', ["nome", "preco"])
                .then(this.renderAll(resp, next))
                .catch(next);
        };
    }
    prepareOne(query) {
        return query.populate('empresa').populate('produtos.produto');
    }
    applyRoutes(application) {
        application.get('/vendas', this.findAll); //Listar
        application.get('/vendas/:id', [this.validateId, this.findById]); //Listar Por ID
        application.post('/vendas', this.save); //Adicionar
        application.post('/vendas/:id/produtos', this.adicionaProdutos); //Adicionar Produtos a Venda
    }
}
exports.vendasRouter = new VendasRouter();
