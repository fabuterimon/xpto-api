import { Server } from './server/server'
import { produtosRouter } from './produto/produto.router'
import { empresasRouter } from './empresa/empresa.router'
import { vendasRouter } from './venda/vendas.router'

const server = new Server()

server.bootstrap([
  produtosRouter,
  empresasRouter,
  vendasRouter
]).then(server => {
  console.log('Server is listening on:', server.application.address())
}).catch(error => {
  console.log('Server faild to start')
  console.log('error')
  process.exit(1)
})
