import * as mongoose from 'mongoose'


export interface Empresas extends mongoose.Document{
  cnpj:string,
  nome:string,
  perc_desconto: number,
  ativo: boolean
}

const empresaSchema = new mongoose.Schema({
  cnpj:{
    type: String,
    required: true
  },
  nome:{
    type: String,
    required: true
  },
  perc_desconto:{
    type: Number,
    required: true
  },
  ativo:{
    type: Boolean,
    required: true
  }
})

export const Empresas = mongoose.model<Empresas>('Empresas', empresaSchema)
