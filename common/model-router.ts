import { Router } from './router'
import * as mongoose from 'mongoose'
import { NotFoundError } from 'restify-errors'

// Defino um objeto gérico D rw
export abstract class ModelRouter<D extends mongoose.Document> extends Router {
  constructor(protected model: mongoose.Model<D>) {
    super()
  }

  protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
    return query
  }
//Verifica se o Id é de um tipo válido
  validateId = (req, resp, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      next(new NotFoundError('Document not found'))
    } else {
      next()
    }
  }

  //Procura todos os documentos do modelo
  findAll = (req, resp, next) => {
    this.model.find()
      .then(this.renderAll(resp, next))
      .catch(next)
  }

  //Procura documnto pelo ID
  findById = (req, resp, next) => {
    this.prepareOne(this.model.findById(req.params.id))
      .then(this.render(resp, next))
      .catch(next)
  }

  //Salva o Documento
  save = (req, resp, next) => {
    let document = new this.model(req.body)
    document.save()
      .then(this.render(resp, next))
      .catch(next)
  }

  //Substitui todo o documento
  replace = (req, resp, next) => {
    const options = { runValidators: true, overwrite: true }
    this.model.update({ _id: req.params.id }, req.body, options)
      .exec().then(result => {
        if (result.n) {
          return this.prepareOne(this.model.findById(req.params.id))
        } else {
          throw new NotFoundError('Documento não encontrado')
        }
      }).then(this.render(resp, next))
      .catch(next)
  }

  //Atualiza parte do documento
  update = (req, resp, next) => {
    const options = { runValidators: true, new: true }
    this.model.findByIdAndUpdate(req.params.id, req.body, options).exec()
      .then(this.render(resp, next))
      .catch(next)
  }

  //Deleta um Documento
  delete = (req, resp, next) => {
    this.model.remove({ _id: req.params.id }).exec().then((cmdResult: any) => {
      if (cmdResult.result.n) {
        resp.send(204)
      } else {
        throw new NotFoundError('Documento não encontrado')
      }
      return next()
    }).catch(next)
  }

  updateJson = (req, resp, next, valor) => {
    const options = { runValidators: true, new: true }
    this.model.findByIdAndUpdate(req.params.id, valor, options).exec().then((data) => {
      if (data === null) {
        throw new NotFoundError('Documento não encontrado')
      }
      return 0
    }).catch((error) => {
      console.log(error);
    })
  }


  updateName = (idProcura, novoProduto) => {
    this.model.findOneAndUpdate({ _id: idProcura }, { nome: novoProduto }, { runValidators: true, new: true }).then((data) => {
      if (data === null) {
        throw new NotFoundError('Documento não encontrado')
      }
      console.log(novoProduto)
      console.log("New cat data", data);
      return 0
    }).catch((error) => {
      throw new NotFoundError('Documento não encontrado')
    }
    );
  }

  updateQuantidade = (idProcura, valor) => {
    this.model.findOneAndUpdate({ _id: idProcura }, { valor_total: valor }, { runValidators: true, new: true }).then((data) => {
      if (data === null) {
        throw new Error('Cat Not Found');
      }
      // resp.json({ message: 'Cat updated!' })
      console.log(valor)
      console.log("New cat data", data);
      return 0
    }).catch((error) => {
      throw new NotFoundError('Documento não encontrado')
    })
  }




}
