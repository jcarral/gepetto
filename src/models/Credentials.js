const chalk = require('chalk');

const isBlank = str => !str || str.length === 0;

class Credentials {

    constructor(data = {}) {
        const { token, password, username,  host, board, displayName} = data;
        this.token = token || password;
        this.username = username;
        this.host = host;
        this.board = board;
        this.displayName = displayName;
    }


    isValid() {
        return !isBlank(this.token)
            && !isBlank(this.username)
            && !isBlank(this.host)
            && !isBlank(this.board)
            && !isBlank(this.displayName);
    }

    print(){
      console.log(chalk.magenta(`👨‍💼 [${this.board}] - ${this.displayName}`))
    }
}

module.exports = Credentials;
