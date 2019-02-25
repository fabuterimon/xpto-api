import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { ModelRouter } from '../common/model-router'
import { NotFoundError } from 'restify-errors'
import { Vendas } from './vendas.model'
import { Empresas } from '../empresa/empresa.model'
import { Produtos } from '../produto/produto.model'
import { ObjectId } from 'mongodb';


class VendasRouter extends ModelRouter<Vendas>{
  constructor() {
    super(Vendas)
  }


  atualizaVenda = (req, resp, next) => {
    Vendas.findById(req.params.id, "+produtos.produto").exec()
      .then(vendas => {
        if (!vendas) {
          console.log(`${req.body}`)
          throw new NotFoundError('Vendas not found')
        } else {

          var valor_total = 0
          var valor_total_json
          var valor_produto = 0
          var desconto
          var valor_desconto = 0
          var novo_valor_json

          /*
          Achar o Percentual de descontos da empresa cujo id está associado a Venda
          */
          desconto = Empresas.findById(vendas.empresa._id).exec().then(emp => {
            if (!emp) {
              console.log(`${req.body}`)
              throw new NotFoundError('Empresa not found')
            } else {
              desconto = emp.perc_desconto
              console.log(`1: ${desconto}`)
              return desconto
            }
          })

          /*
            Percorrer o vetor de Produtos para pegar a quantidade e multiplicar pelo preço
          */
          vendas.produtos.forEach(item => {
            if (!item) {
              console.log(`${req.body}`)
              throw new NotFoundError('Produtos not found')
            } else {
              Produtos.findById(item.produto._id).exec().then(prod => {
                if (!prod) {
                  console.log(`2: ${req.body}`)
                  throw new NotFoundError('Produto Original not found')
                } else {

                  /* Pegando a quantidade e multiplicando pelo preço e
                     Somando o valor total da venda */
                  valor_produto = <number>item.quantidade * prod.preco
                  valor_total = valor_total + valor_produto
                  valor_total_json = JSON.parse(`{"valor_total": ${valor_total} }`);
                  this.updateJson(req, resp, next, valor_total_json)

                  /* Calculando valor de desconto da venda */
                  valor_desconto = valor_total - (<number>valor_total * desconto)
                  novo_valor_json = JSON.parse(`{"valor_desconto": ${valor_desconto} }`);
                  this.updateJson(req, resp, next, novo_valor_json)
                }
              })
            }
          })
        }
        resp.json(vendas)
        return next()
      }).catch(next)
  }

  updateJson = (req, resp, next, valor) => {
    const options = { runValidators: true, new: true }
    this.model.findByIdAndUpdate(req.params.id, valor, options).exec().then((data) => {
      if (data === null) {
        throw new NotFoundError('Documento não encontrado')
      }
      return 0
    }).catch((error) => {
      console.log(error);
    })
  }

  adicionaProdutos = (req, resp, next) => {
    Vendas.findById(req.params.id).then(vendas => {
      if (!vendas) {
        throw new NotFoundError('Vendas not found')
      } else {
        vendas.produtos.push(req.body)
        console.log(`${req.body.produto}`)

        var quant_estoque
        var novo_quant_estoque_json
        // Verifico se o Id do Produto está na tabela Produto

        Produtos.findById(req.body.produto).exec().then(prod =>{
          if (!prod) {
            console.log(`${req.body}`)
            throw new NotFoundError('Vendas not found')
          } else {

            /* Atualizando Valor em Estoque do Produto */
            quant_estoque = prod.quant_estoque - <number>req.body.quantidade
            novo_quant_estoque_json = JSON.parse(`{"quant_estoque": ${quant_estoque} }`);

            Produtos.findByIdAndUpdate(prod._id, novo_quant_estoque_json).exec().then((data) => {
              if (data === null) {
                throw new NotFoundError('Documento não encontrado')
              }
              return 0
            }).catch((error) => {
              console.log(error);
            })

          }
        })
        vendas.save()
          .then(this.render(resp, next))
          .catch(next)
      }
    })
  }

  protected prepareOne(query: mongoose.DocumentQuery<Vendas, Vendas>): mongoose.DocumentQuery<Vendas, Vendas> {
    return query.populate('empresa').populate('produtos.produto')
  }

  findAll = (req, resp, next) => {
    this.model.find()
      .populate('empresa')
      .populate('produtos.produto', ["nome", "preco"])
      .then(this.renderAll(resp, next))
      .catch(next)
  }


  applyRoutes(application: restify.Server) {
    application.get('/vendas', this.findAll) //Listar
    application.get('/vendas/:id', [this.validateId, this.findById]) //Listar Por ID
    application.post('/vendas', this.save) //Adicionar
    application.post('/vendas/:id/produtos', [this.adicionaProdutos, this.atualizaVenda]) //Adicionar Produtos a Venda
  }
}

export const vendasRouter = new VendasRouter()
