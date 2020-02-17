#!/usr/bin/env node

//Set global basedir variable
global.__basedir = __dirname + "/..";

const {
  QuestionConstants
} = require('./constants/');
const {
  CREDENTIALS,
  MENU,
  BOARD
} = QuestionConstants;

const {
  Action,
  Credentials
} = require('./models/');

const {
  MenuQuestions,
  BoardQuestions,
  CredentialsQuestions
} = require('./questions');

const { CredentialsService, JiraService, ExportService, UpdatesService, } = require('./services');
const { printHeader, logger, Notify } = require('./helpers');


const printBoardMenu = async selectedBoard => {
  const loadedBoardAction = new Action(BoardQuestions.LoadedBoard);
  const loadedBoardActionAnswer = await loadedBoardAction.ask();

  logger.info(`[BOARD] User selected: ${JSON.stringify(loadedBoardActionAnswer)}`)
  switch (loadedBoardActionAnswer[BOARD.LOADED_BOARD]) {
    case BOARD.VIEW_USERS:
      JiraService.showBoardUsers(selectedBoard);
      await printBoardMenu(selectedBoard);
      break;
    case BOARD.REFRESH_BOARD:
      selectedBoard = await JiraService.refreshBoard(selectedBoard);
      await printBoardMenu(selectedBoard);
      break;
    case BOARD.VIEW_ISSUES:
      const issues = await JiraService.askForIssues(selectedBoard);
      await ExportService.exportIssues(issues, 'xlsx');
      await printBoardMenu(selectedBoard);
      break;
    case BOARD.VIEW_LOGS:
      const logs = await JiraService.askForLogs(selectedBoard);
      await ExportService.exportLogs(logs, 'xlsx');
      await printBoardMenu(selectedBoard);
      break;
    case BOARD.BACK:
      await printMainMenu(true);
      break;
    default:
      break;
  }

};
const printManageCredentialsMenu = async (hideHeader) => {

  if (!hideHeader) {
    printHeader();
  }

  const manageCredentialsAction = new Action(CredentialsQuestions.ManageCredentialsQuestions);
  const manageCredentialsAnswer = await manageCredentialsAction.ask();

  logger.info(`[CREDENTIALS] User selected: ${JSON.stringify(manageCredentialsAnswer)}`);
  switch (manageCredentialsAnswer[CREDENTIALS.MANAGE_CREDENTIALS]) {

    case CREDENTIALS.VIEW_CREDENTIALS_OPT:
      CredentialsService.viewAllCredentials();
      await printManageCredentialsMenu(true);
      break;
    case CREDENTIALS.ADD_CREDENTIALS_OPT:
      await CredentialsService.askForCredentials();
      await printManageCredentialsMenu();
      break;
    case CREDENTIALS.DELETE_CREDENTIALS_OPT:
      await CredentialsService.askToDeleteCredentials();
      await printManageCredentialsMenu();
      break;
    case CREDENTIALS.BACK_OPT:
      await printMainMenu();
      break;
    case CREDENTIALS.OPEN_FILE:
      await CredentialsService.openCredentialsFile();
      await printManageCredentialsMenu();
      break;
    default:
      break;
  }

};
const printMainMenu = async (hideHeader) => {

  if(!hideHeader){
    printHeader();
  }
  const menuAction = new Action(MenuQuestions.Main)
  const menuActionAnswer = await menuAction.ask();

  logger.info(`[MAIN] User selected: ${JSON.stringify(menuActionAnswer)}`)
  switch (menuActionAnswer[MENU.NAME]) {
    case MENU.MANAGE_CREDENTIALS_OPT:
      return await printManageCredentialsMenu();
    case MENU.BOARDS_OPT:
      const selectedBoard = await JiraService.loadBoard();
      return await printBoardMenu(selectedBoard);
    case MENU.CLOSE_OPT:
      logger.info('Closing manually');
      return process.exit(1);
    default:
      return;
  }
};



//Init
(async () => {

  try {
    printHeader();
    logger.info('Starting GePetto');
    await UpdatesService.checkForUpdates();

    logger.info('Updates checked!');

    if (!CredentialsService.hasCredentials()) {
      logger.info('User first login');
      await CredentialsService.askForCredentials();
    }

    await printMainMenu(true);
  } catch(e) {
    logger.error(e);
  }


})();
