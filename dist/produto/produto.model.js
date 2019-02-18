"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    quant_estoque: {
        type: Number,
        required: true
    }
});
exports.Produtos = mongoose.model('Produtos', produtoSchema);
