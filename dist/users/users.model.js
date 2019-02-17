"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
});
exports.User = mongoose.model('User', userSchema);
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
