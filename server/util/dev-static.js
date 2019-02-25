const axios = require('axios')
const webpack = require('webpack')
const serverConfig = require('../../build/webpack.config.sever')
const MemoryFileSystem = require('memory-fs')
const ReactDom = require('react-dom/server')
const path = require('path')
let serverBundle

const getTemplate = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8888/public/index.html')
            .then((res) => {
                resolve(res.data)
            }).catch(reject)
    })

}
const mfs = new MemoryFileSystem()
const Moudle = module.constructor
const webpackCompile = webpack(serverConfig)

//讲fs读写文件映射到mermroy-fs 在内存上读写
webpackCompile.outputFileSystem = mfs
webpackCompile.watch({}, (error, stats) => {
    if (error) {
        throw error
    }
    stats = stats.toJson();
    stats.errors.forEach(err => {
        console.error(err)
    })
    stats.warnings.forEach(warn => {
        console.error(warn)
    })
    const budlePath = path.join(
        serverConfig.output.filename,
        serverConfig.output.path
    )

    const budle = mfs.readFileSync(budlePath,'utf-8')
    const m = new Moudle()
    m._compile(budle,'server.entry.js')
    serverBundle = m.default


})
module.exports = function (app) {
    app.get('*', function (req, res) {
        getTemplate().then(template => {
            const content = ReactDom.renderToString(serverBundle)
            res.send(template.replace('<!--app-->', content))
        })
    })
}