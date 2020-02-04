const isBlank = str => !str || str.length === 0;

class Credentials {

    constructor(data = {}) {
        const { token, password, username,  host, board} = data;
        this.token = token || password;
        this.username = username;
        this.host = host;
        this.board;
    }


    isValid() {
        return !isBlank(this.token) 
            && !isBlank(this.username) 
            && !isBlank(this.host) 
            && !isBlank(this.board);
    }
}

module.exports = Credentials;