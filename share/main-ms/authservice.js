
class AuthServer {
    constructor () {
        this.authTokens = {}
        this.activeUsers = {}
      }
    login(username, password) {
        let loginData = {}
        if (username in this.activeUsers) {
            loginData = this.activeUsers[username]
            this.authTokens[loginData.authToken].refreshExpiration()
        } else {
            loginData = new AuthLogin(username, password)
            this.authTokens[loginData.authToken] = loginData
            this.activeUsers[username] = loginData.authToken
        }
        const currentTime = new Date()
        const oauthCredentials = {
            token: loginData.authToken,
            timeoutSeconds: Math.floor((loginData.expires - currentTime) / 1000)
        }
        console.log(oauthCredentials);
        return oauthCredentials
    }
    logout(authToken) {
        console.log(`Logout for token: '${authToken}'`);
        console.log(this.authTokens)
        let logMesage = {}
        if (authToken in this.authTokens) {
        const loginData = this.authTokens[authToken]
        console.log("here", loginData);
            delete this.activeUsers[loginData.username]
            delete this.authTokens[authToken]
         logMesage = { message: "Logged out successfully."}
        } else {
            console.log("Token not found.")
            logMesage = { message: "Token not found."}
        }
        return logMesage
    }
}

class AuthLogin {
    constructor(username, password) {
        this.username = username
        this.authToken = Math.random().toString(16).substr(2, 8)
        this.refreshExpiration()
    }
    refreshExpiration() {
        const currentTime = new Date()
        this.expires = currentTime.setDate(currentTime.getDate() + 1)
    }
}

module.exports = { AuthServer, AuthLogin }