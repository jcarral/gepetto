const { JiraClient, Board : JiraBoard } = require('jira-simple');

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
  console.log(res);
  const selectedCredentials = storedCredentials.find(st => st.board === res[BOARD.MAIN]);

  let selectedBoard = null;

  if(selectedCredentials) {
    selectedBoard = new Board(selectedCredentials, null);
  }

  return selectedBoard;
}

const loadBoard = async (board) => {
    console.log(board);

     
};

module.exports = {
  askToSelectBoard,
  loadBoard
}