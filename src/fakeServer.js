const fs = require('fs');
const cors = require('cors')
const mime = require('mime');
const express = require('express')
const app = express()


function start(options) {
  const path = options.emulate
  const port = +options.port || 0
  let srv = null
  app.use(cors())
  app.get('/', (req, res) => {
    const dirs = fs.readdirSync(`${path}`, 'utf8');
    const mapped = dirs.reduce(function (acc, n) {
      acc[n] = {
        artifactId: n,
        installationId: `${n}-installation-1`,
        baseUrl: `http://localhost:${srv.address().port}/artifact`,
      }
      return acc
    }, {})
    res.json(mapped)
  });
  app.get('/artifact/:folderName/:skd_key/*', (req, res) => {
    const {folderName} = req.params
    const file = req.params['0'] && req.params['0'].endsWith('/') ? req.params['0'].replace(/.$/, "") : req.params['0']
    var content = fs.readFileSync(`${path}/${folderName}/${file}`);
    res.type(mime.getType(file));
    res.send(content);
    res.end();
  });


  srv = app.listen(port, () => {
    console.log(`DivSrc emulator is listening on http://localhost:${srv.address().port}`)
  })
  return srv
}

module.exports = {
  start
}