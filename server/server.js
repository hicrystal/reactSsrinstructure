const express = require('express');
const serverEntry = require('../dist/sever.entry').default;
const reactSSR = require('react-dom/server');
const fs = require('fs');
const path = require('path')
const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
const app = express()
app.use('/public', express.static(path.join(__dirname, '../dist')))
app.get('*', function (req, res) {
    const appString = reactSSR.renderToString(serverEntry)
    res.send(template.replace('<app></app>', appString))
})
app.listen(3333, function () {
    console.log('server has been started on 3333')
})