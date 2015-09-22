let plugin = require('..').plugin

exports.getUser = (req, res, next) => {
  let user = req.params.user

  plugin.userController.addUser(user)

  res.send('<h1>Hello ' + user + '</h1><img src="/r/it-worked.gif">')
  res.end()
}