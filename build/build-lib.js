process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.lib.conf')
var spinner = ora('building for library...')
spinner.start()

rm(path.join(config.lib.assetsRoot, config.lib.assetsSubDirectory), err => {
  if (err) throw err

  var configs = [
	webpackConfig({
      minimize: true//Make minimize build
    }),
	webpackConfig({
      minimize: false//Call without minimize
    }),
    webpackConfig({
      components: true,//Create separate components
      minimize: true//With minimize
    })
  ]

  var promises = []

  configs.forEach(function (config) {
    var promise = new Promise(function (resolve, reject) {
      webpack(config, function (err, stats) {
          if (err) reject(err)
          else resolve(stats)
      })
    })
    promises.push(promise)
  })

  Promise.all(promises).then(function (results) {
    results.forEach(function (stats) {
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')
    }) 
    spinner.stop()
    spinner.succeed('Build complete!')
  }).catch(function (err) {
    throw err
  })
  
})
