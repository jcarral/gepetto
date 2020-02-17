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
const { logger } = require('../helpers');


//TODO: Force user to add Credentials or close if there are not
const askToSelectBoard = async () => {
  let selectBoardAction = new Action(BoardQuestions.Main);
  const storedCredentials = CredentialsService.getCredentials();

  if(!storedCredentials.length) {
    console.log('You cannot select a board without credentials, you must add them before trying to get a board');
    return logger.warn('User is trying to get a board without credentials');
  }

  const choices = storedCredentials.map(cred => ({
    name: cred.displayName,
    value: cred.board
  }));

  selectBoardAction.setChoices(BOARD.MAIN, choices);
  const res = await selectBoardAction.ask();
  const selectedCredentials = storedCredentials.find(st => st.board === res[BOARD.MAIN]);

  let selectedBoard = null;

  if (selectedCredentials) {
    return new Board(selectedCredentials, null);
  } else {
    console.log('You must select one board');
    logger.warn('User did not select a board')
  }
}

const getBoard = async board => {
  logger.info(`Trying to load board : ${board.credentials.board}`);

  const client = new JiraClient({
    host: board.credentials.host,
    username: board.credentials.username,
    password: board.credentials.token,
  });
  const boardSpinner = new Spinner('Loading board');
  boardSpinner.start();
  const loadedBoard = await client.getBoard(board.credentials.board);
  logger.info(JSON.stringify(loadedBoard))
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
  if (!answer[BOARD.AUTHOR] || !answer[BOARD.AUTHOR].length) {
    delete answer[BOARD.AUTHOR];
  }
  answer.first = answer.first.toISOString().split('T')[0];
  answer.last = answer.last.toISOString().split('T')[0];
  return answer;
};

const askForIssues = async board => {
  const answer = await doAskForBoardIssues(board);
  logger.info(`Issues queryParams ${JSON.stringify(answer)}`);
  const issues = board.getIssues(answer);
  return issues;

};

const askForLogs = async board => {
  const answer = await doAskForBoardIssues(board);
  logger.info(`Logs queryParams ${JSON.stringify(answer)}`);
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
