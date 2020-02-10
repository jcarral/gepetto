class Board {
    constructor(credentials, jiraBoard) {
        this.credentials = credentials;
        this.jiraBoard = jiraBoard;
    }

    getUsers(){
      return this.jiraBoard ? this.jiraBoard.getUsers() : [];
    }

    getIssues(queryParams){
      return this.jiraBoard ? this.jiraBoard.getIssues(queryParams) : []
    }

    getLogs(queryParams){
      return this.jiraBoard ? this.jiraBoard.getLogsByDay(queryParams) : []
    }
}

module.exports = Board;
