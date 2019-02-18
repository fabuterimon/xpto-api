import * as restify from 'restify'
import * as mongoose from 'mongoose'
import {ModelRouter} from '../common/model-router'
import {Vendas} from './vendas.model'

class VendasRouter extends ModelRouter<Vendas>{
  constructor(){
    super(Vendas)
  }

  applyRoutes(application: restify.Server){
    application.get('/vendas', this.findAll)
    application.get('/vendas/:id', [this.validateId ,this.findById])
    application.post('/vendas', this.save)
  }
}

export const vendasRouter = new VendasRouter()
