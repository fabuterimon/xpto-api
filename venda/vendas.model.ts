import * as mongoose from 'mongoose'
import {Empresas} from '../empresa/empresa.model'
import {Produtos} from '../produto/produto.model'

export interface listaProdutoSchema extends mongoose.Document{
  produto: mongoose.Types.ObjectId | Produtos
  quantidade : Number
}

export interface Vendas extends mongoose.Document {
  valor_total: number,
  valor_desconto: number,
  nome_cli: string,
  produto: mongoose.Types.ObjectId | Produtos
  produtos: listaProdutoSchema[],
  empresa: mongoose.Types.ObjectId | Empresas,
}

const listaProdutoSchema = new mongoose.Schema({
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Produtos'
  },
  quantidade:{
    type: Number,
    required: true
  }
})

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
      default:[]
  },
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Empresas'
  },
})

export const Vendas = mongoose.model<Vendas>('Vendas', vendaSchema)
