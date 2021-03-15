const app = require('./app')

app.server = app.listen(8081, function () {
  console.log('Resolver app listening on port 8081...')
})
