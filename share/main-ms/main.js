const e = require("express")
const { AuthServer } = require("./authservice")

const authServer = new AuthServer()


const login = (call, callback) => {
    let username = call.request.username
    let password = call.request.password
    console.log(`Login for username: '${username}'`)
    const authData = authServer.login(username, password)
    callback(null, authData)
  }

const logout = (call, callback) => {
    let authToken = call.request.token
    console.log(`Logout for token: '${authToken}'`)
    const authData = authServer.logout(authToken)
    callback(null, authData)
}

// export { login, logout}
module.exports = { login, logout}