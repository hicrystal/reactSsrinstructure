const express = require('express');
const reactSSR = require('react-dom/server');
const fs = require('fs');
const path = require('path')
const app = express()
const isDEV = process.env.NODE_ENV === 'development';

if (!isDEV) {
    const serverEntry = require('../dist/sever.entry').default;
    const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
    app.use('/public', express.static(path.join(__dirname, '../dist')))
    app.get('*', function (req, res) {
        const appString = reactSSR.renderToString(serverEntry)
        res.send(template.replace('<!--app-->', appString))
    })
}else {
    const devStatic = require('./util/dev-static')
    devStatic(app)
}

app.listen(3333, function () {
    console.log('server has been started on 3333')
})