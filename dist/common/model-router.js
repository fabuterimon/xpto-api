"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        //Verifica se o Id é de um tipo válido  
        this.validateId = (req, resp, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError('Document not found'));
            }
            else {
                next();
            }
        };
        //Procura todos os documentos do modelo
        this.findAll = (req, resp, next) => {
            this.model.find()
                .then(this.renderAll(resp, next))
                .catch(next);
        };
        //Procura documnto pelo ID
        this.findById = (req, resp, next) => {
            this.prepareOne(this.model.findById(req.params.id))
                .then(this.render(resp, next))
                .catch(next);
        };
        //Salva o Documento
        this.save = (req, resp, next) => {
            let document = new this.model(req.body);
            document.save()
                .then(this.render(resp, next))
                .catch(next);
        };
        //Substitui todo o documento
        this.replace = (req, resp, next) => {
            const options = { runValidators: true, overwrite: true };
            this.model.update({ _id: req.params.id }, req.body, options)
                .exec().then(result => {
                if (result.n) {
                    return this.prepareOne(this.model.findById(req.params.id));
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            }).then(this.render(resp, next))
                .catch(next);
        };
        //Atualiza parte do documento
        this.update = (req, resp, next) => {
            const options = { runValidators: true, new: true };
            this.model.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        };
        //Deleta um Documento
        this.delete = (req, resp, next) => {
            this.model.remove({ _id: req.params.id }).exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                return next();
            }).catch(next);
        };
        this.updateName = (idProcura, novoProduto) => {
            this.model.findOneAndUpdate({ _id: idProcura }, { nome: novoProduto }, { runValidators: true, new: true }).then((data) => {
                if (data === null) {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                console.log(novoProduto);
                console.log("New cat data", data);
                return 0;
            }).catch((error) => {
                throw new restify_errors_1.NotFoundError('Documento não encontrado');
            });
        };
        this.updateQuantidade = (idProcura, valor) => {
            this.model.findOneAndUpdate({ _id: idProcura }, { valor_total: valor }, { runValidators: true, new: true }).then((data) => {
                if (data === null) {
                    throw new Error('Cat Not Found');
                }
                // resp.json({ message: 'Cat updated!' })
                console.log(valor);
                console.log("New cat data", data);
                return 0;
            }).catch((error) => {
                throw new restify_errors_1.NotFoundError('Documento não encontrado');
            });
        };
    }
    prepareOne(query) {
        return query;
    }
}
exports.ModelRouter = ModelRouter;
