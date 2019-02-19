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
          var desconto = 0
//vendas.empresa.id
          Empresas.findById( { "vendas.empresa": ObjectId }).then(emp => {
            desconto = emp.perc_desconto
            // console.log(`${emp.perc_desconto}`)
            console.log(`${desconto}`)
          })

          // vendas.produtos.forEach(item => {
          //   Produtos.findById(item._id).then(prod => {
          //     prod.quant_estoque = prod.quant_estoque - item.quantidade
          //     console.log(`Item.Quantidade: ${desconto}`)
          //   })
          //   soma = soma + item.quantidade
          //
          // })
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
        resp.json(vendas.valor_total)
        return next()
      }).catch(next)
  }



  updateQuantidade = (idProcura, valor) => {
    this.model.findOneAndUpdate({ _id: idProcura }, { valor_total: valor }, { runValidators: true, new: true }).then((data) => {
      if (data === null) {
        throw new Error('Cat Not Found');
      }
      // resp.json({ message: 'Cat updated!' })
      //console.log(valor)
      //console.log("New cat data", data);
      return 0
    }).catch((error) => {
      /*
          Deal with all your errors here with your preferred error handle middleware / method
       */
      // resp.status(500).json({ message: 'Some Error!' })
      console.log(error);
    })
  }

  updateDesconto = (idProcura, valor) => {
    this.model.findOneAndUpdate({ _id: idProcura }, { valor_desconto: valor }, { runValidators: true, new: true }).then((data) => {
      if (data === null) {
        throw new Error('Cat Not Found');
      }
      // resp.json({ message: 'Cat updated!' })
      // console.log(valor)
      // console.log("New cat data", data);
      return 0
    }).catch((error) => {
      /*
          Deal with all your errors here with your preferred error handle middleware / method
       */
      // resp.status(500).json({ message: 'Some Error!' })
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
