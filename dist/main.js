"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const produto_router_1 = require("./produto/produto.router");
const empresa_router_1 = require("./empresa/empresa.router");
const vendas_router_1 = require("./venda/vendas.router");
const server = new server_1.Server();
server.bootstrap([
    produto_router_1.produtosRouter,
    empresa_router_1.empresasRouter,
    vendas_router_1.vendasRouter
]).then(server => {
    console.log('Server is listening on:', server.application.address());
}).catch(error => {
    console.log('Server faild to start');
    console.log('error');
    process.exit(1);
});
