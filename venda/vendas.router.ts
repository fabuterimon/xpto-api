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


  findProdutos = (req, resp, next) => {
    Vendas.findById(req.params.id, "+produtos.produto")
      .then(vendas => {
        if (!vendas) {
          console.log(`${req.body}`)
          throw new NotFoundError('Vendas not found')
        } else {
          var soma = 0
          var quantidade = 0
          var valor_produto = 0
          var desconto = 0

          /*
          Achar o Percentual de descontos da empresa cujo id está associado a Venda
          */
          Empresas.findById(vendas.empresa._id).then(emp => {

            if (!emp) {
              console.log(`${req.body}`)
              throw new NotFoundError('Empresa not found')
            } else {
              desconto = emp.perc_desconto
              console.log(`1: ${desconto}`)
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
              Produtos.findById(item.produto._id).then(prod => {
                if (!prod) {
                  console.log(`2: ${req.body}`)
                  throw new NotFoundError('Produto Original not found')
                } else {
                  //prod.quant_estoque = prod.quant_estoque - item.quantidade
                  valor_produto = item.quantidade * prod.preco
                  console.log(`3: valor_produto: ${valor_produto}`)
                }
              })
              console.log(`4.0: soma: ${valor_produto}`)
              soma = soma + valor_produto
              console.log(`4.1: soma: ${soma}`)
            }
          })

          console.log(`5: Soma dos Produtos: ${soma}`)
          console.log(`6: ${desconto}`)
          // console.log(`${valor_desconto}`)
          //
          // this.updateQuantidade(req.params.id, soma)
          // var valor_desconto = (soma - (soma * desconto))
          //
          // console.log(`Soma dos Produtos: ${soma}`)
          // console.log(`${desconto}`)
          // console.log(`${valor_desconto}`)
          //
          // this.updateDesconto(req.params.id, valor_desconto)
        }
        resp.json(vendas)
        return next()
      }).catch(next)
  }

  updateQuantidade = (idProcura, valor) => {
    this.model.findOneAndUpdate({ _id: idProcura }, { valor_total: valor }, { runValidators: true, new: true }).then((data) => {
      if (data === null) {
        throw new Error('Cat Not Found');
      }
      return 0
    }).catch((error) => {
      // resp.status(500).json({ message: 'Some Error!' })
      console.log(error);
    })
  }

  updateDesconto = (idProcura, valor) => {
    this.model.findOneAndUpdate({ _id: idProcura }, { valor_desconto: valor }, { runValidators: true, new: true }).then((data) => {
      if (data === null) {
        throw new Error('Cat Not Found');
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
        var soma = 0
        console.log(`${vendas.produtos}`);
        vendas.produtos.forEach(item => {
          // soma = soma + item.quantidade
          console.log(`${item}`)
        })
        console.log(`${vendas.produtos}`)
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
      .populate('produtos.produto')
      .then(this.renderAll(resp, next))
      .catch(next)
  }


  applyRoutes(application: restify.Server) {
    application.get('/vendas', this.findAll)
    application.get('/vendas/:id', [this.validateId, this.findById])
    application.post('/vendas', this.save)

    application.get('/vendas/:id/produtos', this.findProdutos)
    //  application.put('/vendas/:id/produtos', this.adicionaProdutos)

  }
}

export const vendasRouter = new VendasRouter()
