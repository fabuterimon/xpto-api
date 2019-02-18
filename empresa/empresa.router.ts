import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {Empresas} from './empresa.model'

class EmpresasRouter extends ModelRouter<Empresas> {
  constructor(){
    super(Empresas)
  }

  applyRoutes(application: restify.Server){
    application.get('/empresas', this.findAll)
    application.get('/empresas/:id', [this.validateId ,this.findById])
    application.post('/empresas', this.save)
    application.put('/empresas/:id',this.replace)
    application.patch('/empresas/:id', this.update)
    application.del('/empresas/:id',this.delete)
  }

}

export const empresasRouter = new EmpresasRouter()
