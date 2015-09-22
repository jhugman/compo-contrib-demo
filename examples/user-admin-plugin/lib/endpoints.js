let plugin = require('..').plugin

exports.getUsers = function (req, res, next) {
  let users = plugin.userController.getUsers()
  let lines = ['<h1>All users</h1>']
  if (users.length > 0) {
    lines.push('<ul>')
    users.forEach((u) => {
      lines.push('<li>' + u + '</u>')
    })
    lines.push('</ul>')
  } else {
    lines.push('<p>No users :(</p>')
  }
  res.send(lines.join(''))
  res.end()
}