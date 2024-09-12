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

}

module.exports = Server