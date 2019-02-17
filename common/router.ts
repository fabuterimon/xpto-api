import * as restify from 'restify'
import { EventEmitter } from 'events'
import { NotFoundError } from 'restify-errors'


// Verifica existe resosta valida para requisião e repassa e com o
// EventEmitter eu controlo o caso de mostrar o password no get

export abstract class Router extends EventEmitter {

  abstract applyRoutes(application: restify.Server)

  render(response: restify.Response, next: restify.Next) {
    return (document) => {
      if (document) {
        this.emit('beforeRender', document)
        response.json(document)
      }
      else {
        throw new NotFoundError('Documento não encontrado')
      }
      return next()
    }
  }

  renderAll(response: restify.Response, next: restify.Next) {
    return (documents: any[]) => {
      if (documents) {
        documents.forEach(document=>{
          this.emit('beforeRender',document)
        })
        response.json(documents)
      }
      else{
        response.json([])
      }
    }

  }
}
