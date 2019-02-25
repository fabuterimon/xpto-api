import * as restify from 'restify'

export const handleError = (req: restify.Request, resp: restify.Response, err, done) => {
  //restify procura toJason para criar o corpo do objeto error
  console.log(err)
  err.toJSON = () => {
    return {
      message: err.message
    }
  }

  switch (err.name) {
    case 'MongoError':
      if (err.code === 11000) {
        err.statuscode = 400
      }
      break
    case 'ValidatorError':
      err.statuscode = 400
      break
  }

  done()
}
