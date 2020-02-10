const {
  JiraClient,
  Board: JiraBoard,
  Time
} = require('jira-simple');
const {
  Spinner
} = require('clui');

const {
  BoardQuestions
} = require('../questions');
const {
  Credentials,
  Action,
  Board
} = require('../models');

const {
  QuestionConstants
} = require('../constants');
const {
  BOARD
} = QuestionConstants;
const CredentialsService = require('../services/credentials.service');


//TODO: Force user to add Credentials or close if there are not
const askToSelectBoard = async () => {
  let selectBoardAction = new Action(BoardQuestions.Main);
  const storedCredentials = CredentialsService.getCredentials();

  const choices = storedCredentials.map(cred => ({
    name: cred.displayName,
    value: cred.board
  }));

  selectBoardAction.setChoices(BOARD.MAIN, choices);
  const res = await selectBoardAction.ask();
  const selectedCredentials = storedCredentials.find(st => st.board === res[BOARD.MAIN]);

  let selectedBoard = null;

  if (selectedCredentials) {
    selectedBoard = new Board(selectedCredentials, null);
  }

  return selectedBoard;
}

const getBoard = async board => {
  const client = new JiraClient({
    host: board.credentials.host,
    username: board.credentials.username,
    password: board.credentials.token,
  });
  const boardSpinner = new Spinner('Loading board');
  boardSpinner.start();
  const loadedBoard = await client.getBoard(board.credentials.board);
  boardSpinner.stop();
  board.jiraBoard = loadedBoard;
  return board;
};

const loadBoard = async () => {
  let board = await askToSelectBoard()
  return await getBoard(board);
};

const showBoardUsers = board => {
  const users = board.getUsers();
  users.forEach(user => {
    console.log(`👳‍♂️ ${user.name}`);
  });
};

const refreshBoard = async board => {
  return await getBoard(board);
};

const doAskForBoardIssues = async board => {
  const askIssuesAction = new Action(BoardQuestions.QueryBoard);

  const boardUsers = board.getUsers();

  if (boardUsers.length) {
    const choices = [{
      name: 'Search all',
      value: ''
    }, ...boardUsers.map(user => ({
      name: `👳‍♂️ ${user.name}`,
      value: user.name
    }))];
    askIssuesAction.setChoices(BOARD.AUTHOR, choices);
  } else {
    askIssuesAction.removeQuestion(BOARD.AUTHOR);
  }


  let answer = await askIssuesAction.ask();
  if (answer[BOARD.AUTHOR] && !answer[BOARD.AUTHOR].length) {
    delete answer[BOARD.AUTHOR];
  }
  answer.first = answer.first.toISOString().split('T')[0];
  answer.last = answer.last.toISOString().split('T')[0];
  return answer;
};

const askForIssues = async board => {

  const answer = await doAskForBoardIssues(board);
  const issues = board.getIssues(answer);
  return issues;

};

const askForLogs = async board => {
  const answer = await doAskForBoardIssues(board);
  const logs = board.getLogs(answer);
  return logs;
}



module.exports = {
  loadBoard,
  showBoardUsers,
  refreshBoard,
  askForIssues,
  askForLogs
}
