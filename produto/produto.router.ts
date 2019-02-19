import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { Produtos } from './produto.model'

class ProdutosRouter extends ModelRouter<Produtos> {
  constructor() {
    super(Produtos)
  }

  // update = (req, resp, next)=>{
  //   const options = {runValidators: true, new : true}
  //   this.model.findByIdAdUpdate(req.params.id, req.body, options)
  //       .then(this.render(resp, next))
  //       .catch(next)
  // }
  //`${this.novoProduto}`
  //{nome:'Panela de Vapor'}

  applyRoutes(application: restify.Server) {


    application.get('/produtos', this.findAll)
    application.get('/produtos/:id', [this.validateId, this.findById])
    application.post('/produtos', this.save)
    application.put('/produtos/:id', this.replace)
    //application.patch('/produtos/:id', this.update)
    // application.patch('/produtos/', this.updateOne)
    application.del('/produtos/:id', this.delete)

  //  this.updateName(this.idProcura, this.novoProduto)

  }









}



export const produtosRouter = new ProdutosRouter()
