
let resolver = require('./libresolver.js')
let express = require('express')
let app = express()

app.get('/1.0/dids/*', function (req, res) {

  let url = req.url
  let regex = /\/1.0\/dids\/(did:uport:.*)/
  let did = regex.exec(url)[1]

  console.log(did)

  resolver.uportResolveLegacy(did, (err, doc) => {
    res.send(doc)
  })

})

var server = app.listen(8081, function () {
  console.log("Tutorial app running...")
})
