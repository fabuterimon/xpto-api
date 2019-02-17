"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const restaurtants_router_1 = require("./restaurants/restaurtants.router");
const reviews_router_1 = require("./reviews/reviews.router");
const server = new server_1.Server();
server.bootstrap([
    users_router_1.usersRouter,
    restaurtants_router_1.restaurantsRouter,
    reviews_router_1.reviewsRouter
]).then(server => {
    console.log('Server is listening on:', server.application.address());
}).catch(error => {
    console.log('Server faild to start');
    console.log('error');
    process.exit(1);
});
