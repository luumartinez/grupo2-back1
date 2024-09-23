const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 8080

    this.middleware()
    this.routes()
  }

  middleware() {
    this.app.use(express.json())
    this.app.use(express.static(path.join(__dirname, '../public')))
    this.app.use(cors())
    this.app.use(morgan('dev'))
  }

  routes() { 
    /* routes */
    this.app.use('/api/usuarios', require('../routes/usuarios.routes'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server ok en el puerto', this.port)
    })
  }

}

module.exports = Server