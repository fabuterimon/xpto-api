"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const empresaSchema = new mongoose.Schema({
    cnpj: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    perc_desconto: {
        type: Number,
        required: true
    },
    ativo: {
        type: Boolean,
        required: true
    }
});
exports.Empresas = mongoose.model('Empresas', empresaSchema);
