import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { ModelRouter } from '../common/model-router'
import { NotFoundError } from 'restify-errors'
import { Vendas } from './vendas.model'

class VendasRouter extends ModelRouter<Vendas>{
  constructor() {
    super(Vendas)
  }

  findProdutos = (req, resp, next) => {
    Vendas.findById(req.params.id, "+produtos")
      .then(vendas => {
        if (!vendas) {
          throw new NotFoundError('Vendas not found')
        } else {
          resp.json(vendas.produtos)
          return next()
        }
      }).catch(next)
  }

  adicionaProdutos = (req, resp, next) => {
    Vendas.findById(req.params.id, "+produtos").then(vendas => {
      if (!vendas) {
        throw new NotFoundError('Vendas not found')
      } else {
        console.log(`${vendas.produtos}`)
        //vendas.produtos = req.body
        vendas.produtos.push(req.body)
        console.log(`${vendas.produtos}`)
        vendas.save()
          .then(this.render(resp, next))
          .catch(next)
      }
    })
  }

  protected prepareOne(query: mongoose.DocumentQuery<Vendas,Vendas>): mongoose.DocumentQuery<Vendas,Vendas>{
    return query.populate('produto').populate('empresa')
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



  applyRoutes(application: restify.Server) {
    application.get('/vendas', this.findAll)
    application.get('/vendas/:id', [this.validateId, this.findById])
    application.post('/vendas', this.save)

    application.get('/vendas/:id/produtos', this.findProdutos)
    application.put('/vendas/:id/produtos', this.adicionaProdutos)

  }
}

export const vendasRouter = new VendasRouter()
