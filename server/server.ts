import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { environment } from '../common/environment'
import { Router } from '../common/router'
import {handleError} from './error.handler'

export class Server {

  application: restify.Server;

  initializeDB(){
    (<any>mongoose).Promise = global.Promise;
    return mongoose.connect(environment.db.url);
  }


  //
  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {

        // criação do servidor
        this.application = restify.createServer({
          name: 'xpto-api',
          version: '1.0.0'
        })

        /* mostrar querys q estão escodidas */
        this.application.use(restify.plugins.queryParser());
        //transformar objeto buffer de objeto json em body
        this.application.use(restify.plugins.bodyParser());

        //routes
        for (let router of routers) {
          router.applyRoutes(this.application)
        }

        this.application.listen(environment.server.port, () => {
          resolve(this.application)
        })

        this.application.on('restifyError', handleError)


      } catch (error) {
        reject(error)
      }
    })
  }

  //bootstrap recebe um arry de routers inicializado
  // vazio para caso ninguem passe nada para o bootstrap
  bootstrap(routers: Router[] = []): Promise<Server> {
    // return this.initRoutes(routers).then(() => this)

    return this.initializeDB().then(() =>
      this.initRoutes(routers).then(() => this))

  }


}
