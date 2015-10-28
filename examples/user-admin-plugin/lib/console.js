let plugin = require('..').plugin

exports.getUsers = (println, tokens) => {
  let users = plugin.userController.getUsers()
  println('All users:')
  users.forEach((u) => {
    println('\t' + u)
  })
  if (users.length === 0) {
    println('\tNone.')
  }
}