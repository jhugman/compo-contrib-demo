let plugin = require('..').plugin

exports.getUsers = (output, tokens) => {
  let users = plugin.userController.getUsers()
  output.log('All users:')
  users.forEach((u) => {
    output.log('\t' + u)
  })
  if (users.length === 0) {
    output.log('\tNone.')
  }
}