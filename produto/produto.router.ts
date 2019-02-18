import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {Produtos} from './produto.model'

class ProdutosRouter extends ModelRouter<Produtos> {
  constructor(){
    super(Produtos)
  }

  applyRoutes(application: restify.Server){
    application.get('/produtos', this.findAll)
    application.get('/produtos/:id', [this.validateId ,this.findById])
    application.post('/produtos', this.save)
    application.put('/produtos/:id',this.replace)
    application.patch('/produtos/:id', this.update)
    application.del('/produtos/:id',this.delete)
  }

}

export const produtosRouter = new ProdutosRouter()
