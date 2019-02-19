import * as mongoose from 'mongoose'
import {Empresas} from '../empresa/empresa.model'
import {Produtos} from '../produto/produto.model'

export interface listaProdutoSchema extends mongoose.Document{
  produto: mongoose.Types.ObjectId | Produtos
}

export interface Vendas extends mongoose.Document {
  valor_total: number,
  valor_desconto: number,
  nome_cli: string,
  produtos: listaProdutoSchema[],
  empresa: mongoose.Types.ObjectId | Empresas,
}

const listaProdutoSchema = new mongoose.Schema({
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Produtos',
    default:[]
  }})

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
