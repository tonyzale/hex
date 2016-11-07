const express = require('express');
const swig = require('swig');
var app = express();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', 'app/serve');
app.use(express.static('app/serve'))
app.use(express.static('.'))

app.get('/', function (req, res) {
  res.render('index');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})