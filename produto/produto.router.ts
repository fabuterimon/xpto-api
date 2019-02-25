import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { Produtos } from './produto.model'

class ProdutosRouter extends ModelRouter<Produtos> {
  constructor() {
    super(Produtos)
  }

  applyRoutes(application: restify.Server) {

    application.get('/produtos', this.findAll) //Listar
    application.get('/produtos/:id', [this.validateId, this.findById])  //Listar por ID
    application.post('/produtos', this.save) //Adicionar
    application.put('/produtos/:id', [this.validateId,this.replace]) //Substituir
    application.patch('/produtos/:id', [this.validateId,this.update]) //Modificar
    application.del('/produtos/:id', [this.validateId,this.delete])  //Apagar
  }

}

export const produtosRouter = new ProdutosRouter()
