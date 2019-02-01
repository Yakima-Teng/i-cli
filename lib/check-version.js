const request = require('request')
const semver = require('semver')
const chalk = require('chalk')
const packageConfig = require('../package.json')

module.exports = done => {
  // Ensure minimum supported node version is used
  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    return console.log(chalk.red(
      '  You must upgrade node to >=' + packageConfig.engines.node + '.x to use i-cli'
    ))
  }

  request({
    url: 'https://registry.npmjs.org/i-cli',
    timeout: 1000
  }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      // npm dist-tag add <pkg>@<version> [<tag>]
      // npm dist-tag rm <pkg> <tag>
      // npm dist-tag ls [<pkg>]
      // aliases: dist-tags
      // description: Add, remove, and enumerate distribution tags on a package
      const latestVersion = JSON.parse(body)['dist-tags'].latest
      const localVersion = packageConfig.version
      // lt is short for "less than"
      if (semver.lt(localVersion, latestVersion)) {
        console.log(chalk.yellow('  i-cli有新版本啦，请及时通过`npm i -g i-cli`命令更新到最新版本！'))
        console.log()
        console.log('  latest:    ' + chalk.green(latestVersion))
        console.log('  installed: ' + chalk.red(localVersion))
        console.log()
      }
    }
    done()
  })
}
