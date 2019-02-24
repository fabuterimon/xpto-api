"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const restify_errors_1 = require("restify-errors");
const vendas_model_1 = require("./vendas.model");
const empresa_model_1 = require("../empresa/empresa.model");
const produto_model_1 = require("../produto/produto.model");
class VendasRouter extends model_router_1.ModelRouter {
    constructor() {
        super(vendas_model_1.Vendas);
        this.atualizaVenda = (req, resp, next) => {
            vendas_model_1.Vendas.findById(req.params.id, "+produtos.produto").exec()
                .then(vendas => {
                if (!vendas) {
                    console.log(`${req.body}`);
                    throw new restify_errors_1.NotFoundError('Vendas not found');
                }
                else {
                    var valor_total = 0;
                    var valor_total_json;
                    var valor_produto = 0;
                    var desconto;
                    var valor_desconto = 0;
                    var novo_valor_json;
                    /*
                    Achar o Percentual de descontos da empresa cujo id está associado a Venda
                    */
                    desconto = empresa_model_1.Empresas.findById(vendas.empresa._id).exec().then(emp => {
                        if (!emp) {
                            console.log(`${req.body}`);
                            throw new restify_errors_1.NotFoundError('Empresa not found');
                        }
                        else {
                            desconto = emp.perc_desconto;
                            console.log(`1: ${desconto}`);
                            return desconto;
                        }
                    });
                    /*
                      Percorrer o vetor de Produtos para pegar a quantidade e multiplicar pelo preço
                    */
                    vendas.produtos.forEach(item => {
                        if (!item) {
                            console.log(`${req.body}`);
                            throw new restify_errors_1.NotFoundError('Produtos not found');
                        }
                        else {
                            produto_model_1.Produtos.findById(item.produto._id).exec().then(prod => {
                                if (!prod) {
                                    console.log(`2: ${req.body}`);
                                    throw new restify_errors_1.NotFoundError('Produto Original not found');
                                }
                                else {
                                    /* Pegando a quantidade e multiplicando pelo preço e
                                       Somando o valor total da venda */
                                    valor_produto = item.quantidade * prod.preco;
                                    valor_total = valor_total + valor_produto;
                                    valor_total_json = JSON.parse(`{"valor_total": ${valor_total} }`);
                                    this.updateJson(req, resp, next, valor_total_json);
                                    /* Calculando valor de desconto da venda */
                                    valor_desconto = valor_total - (valor_total * desconto);
                                    novo_valor_json = JSON.parse(`{"valor_desconto": ${valor_desconto} }`);
                                    this.updateJson(req, resp, next, novo_valor_json);
                                }
                            });
                        }
                    });
                }
                resp.json(vendas);
                return next();
            }).catch(next);
        };
        this.updateJson = (req, resp, next, valor) => {
            const options = { runValidators: true, new: true };
            this.model.findByIdAndUpdate(req.params.id, valor, options).exec().then((data) => {
                if (data === null) {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                return 0;
            }).catch((error) => {
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
                    console.log(`${req.body.produto}`);
                    var quant_estoque;
                    var novo_quant_estoque_json;
                    // Verifico se o Id do Produto está na tabela Produto
                    produto_model_1.Produtos.findById(req.body.produto).exec().then(prod => {
                        if (!prod) {
                            console.log(`${req.body}`);
                            throw new restify_errors_1.NotFoundError('Vendas not found');
                        }
                        else {
                            /* Atualizando Valor em Estoque do Produto */
                            quant_estoque = prod.quant_estoque - req.body.quantidade;
                            novo_quant_estoque_json = JSON.parse(`{"quant_estoque": ${quant_estoque} }`);
                            produto_model_1.Produtos.findByIdAndUpdate(prod._id, novo_quant_estoque_json).exec().then((data) => {
                                if (data === null) {
                                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                                }
                                return 0;
                            }).catch((error) => {
                                console.log(error);
                            });
                        }
                    });
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
        application.post('/vendas/:id/produtos', [this.adicionaProdutos, this.atualizaVenda]); //Adicionar Produtos a Venda
    }
}
exports.vendasRouter = new VendasRouter();
