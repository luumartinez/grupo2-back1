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

}

module.exports = Server