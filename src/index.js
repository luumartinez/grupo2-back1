const Server = require('./server/config')
const server = new Server()
require('./DB/config')

server.listen()