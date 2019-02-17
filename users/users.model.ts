import * as mongoose from 'mongoose'
import { validateCPF } from '../common/validators'
import { environment } from '../common/environment'
import * as bcrypt from 'bcrypt'

//em typescripty as interfaes não viram objetos então não d problema de ser o memso nome
export interface User extends mongoose.Document {
  name: string,
  email: string,
  password: string,
  gender: string
}


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Diz ao mongoose que aquele campo é indispensável
    maxlength: 80,
    minlength: 3
  },
  email: {
    type: String,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  // cpf: {
  //   type: String,
  //   required: true,
  //   validate: {
  //     validator: validateCPF,
  //     message: '{PATH}: Invalide CPF ({VALUES})'
  //   }
  // },
  gender: {
    type: String,
    required: false,
    enum: ['masculino', 'feminino', 'outro']
  },
})

export const User = mongoose.model<User>('User', userSchema)

// userSchema.pre('save', function(next){
//   const user : User = this
//   if(!user.isModified('password')){
//     next()
//   }
//   else{
//     bcrypt.hash(user.password, environment.security.saltRounds)
//     .then(hash=>{
//       user.password = hash
//       next()
//     }).catch(next)
//   }
// })
