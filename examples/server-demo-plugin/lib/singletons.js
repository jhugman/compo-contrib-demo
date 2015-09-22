exports.UserController = class {
  constructor () {
    this._users = {}
  }

  addUser (user) {
    // some trivial storage.
    this._users[user] = user
  }

  getUsers () {
    return Object.keys(this._users)
  }
}