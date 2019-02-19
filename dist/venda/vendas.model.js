"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const listaProdutoSchema = new mongoose.Schema({
    produto: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Produtos'
    },
    quantidade: {
        type: Number,
        required: true
    }
});
const vendaSchema = new mongoose.Schema({
    valor_total: {
        type: Number,
        required: false,
    },
    valor_desconto: {
        type: Number,
        required: false
    },
    nome_cli: {
        type: String,
        required: true,
        maxlength: 100
    },
    produto: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Produtos'
    },
    produtos: {
        type: [listaProdutoSchema],
        required: false,
        default: []
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Empresas'
    },
});
exports.Vendas = mongoose.model('Vendas', vendaSchema);
