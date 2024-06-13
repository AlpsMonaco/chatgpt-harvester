const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.post('/', jsonParser, function (req, res) {
    res.status(400)
    res.json({"msg":"error"})
})

app.listen(3000)