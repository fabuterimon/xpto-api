import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {Empresas} from './empresa.model'

class EmpresasRouter extends ModelRouter<Empresas> {
  constructor(){
    super(Empresas)
  }

  applyRoutes(application: restify.Server){
    application.get('/empresas', this.findAll)  //Listar
    application.get('/empresas/:id', [this.validateId ,this.findById]) //Listar por ID
    application.post('/empresas', this.save) //Adicionar
    application.put('/empresas/:id',  [this.validateId ,this.replace]) //Substituir
    application.patch('/empresas/:id', [this.validateId ,this.update]) //Modificar
    application.del('/empresas/:id', [this.validateId ,this.delete]) //Apagar 
  }

}

export const empresasRouter = new EmpresasRouter()
