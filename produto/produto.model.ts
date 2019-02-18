import * as mongoose from 'mongoose'


export interface Produtos extends mongoose.Document{
  nome:string,
  preco:number,
  quant_estoque: number
}

const produtoSchema = new mongoose.Schema({
  nome:{
    type: String,
    required: true
  },
  preco:{
    type: Number,
    required: true
  },
  quant_estoque:{
    type: Number,
    required: true
  }
})

export const Produtos = mongoose.model<Produtos>('Produtos', produtoSchema)
