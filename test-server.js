const http = require('http')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)

http
  .createServer(async (req, res) => {
    switch (req.url) {
      case '/wp-json/wplf/v2/submitForm': {
        const json = JSON.stringify(require('./mocks/success.json'))
        res.writeHead(200, {
          'Content-Type': 'text/json',
          'Access-Control-Allow-Origin': '*',
        })
        res.write(json)
        res.end()
        break
      }

      case '/wp-json/wplf/v2/getForm?form=215': {
        const json = JSON.stringify(require('./mocks/form.json'))
        res.writeHead(200, {
          'Content-Type': 'text/json',
          'Access-Control-Allow-Origin': '*',
        })
        res.write(json)
        res.end()
        break
      }

      default: {
        res.writeHead(400, {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*',
        })
        res.write('<h1>Nothing to serve</h1>')
      }
    }
  })
  .listen(8089)

setTimeout(() => process.exit(0), 5000) // Kill mock server after 5 seconds
// Alternatively start server from tests
