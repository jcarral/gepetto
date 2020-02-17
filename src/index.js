#!/usr/bin/env node

//Set global basedir variable
global.__basedir = __dirname + "/..";

const {
  QuestionConstants, ConfigConstants
} = require('./constants/');
const {
  CONFIG,
  MENU,
  BOARD
} = QuestionConstants;

const {
  Action
} = require('./models/');

const {
  MenuQuestions,
  BoardQuestions,
  ConfigQuestions
} = require('./questions');

const { ConfigService, JiraService, ExportService, UpdatesService, } = require('./services');
const { printHeader, logger } = require('./helpers');


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
const printConfigMenu = async (hideHeader) => {

  if (!hideHeader) {
    printHeader();
  }
  logger.info('Printing config menu');
  const configMenuAction = new Action(ConfigQuestions.MainConfigMenuQuestions);
  const configMenuAnswer = await configMenuAction.ask();

  logger.info(`[CONFIG] User selected: ${JSON.stringify(configMenuAnswer)}`);
  switch (configMenuAnswer[CONFIG.MENU]) {

    case CONFIG.VIEW_CREDENTIALS_OPT:
      ConfigService.viewAllCredentials();
      await printConfigMenu(true);
      break;
    case CONFIG.ADD_CREDENTIALS_OPT:
      await ConfigService.askForCredentials();
      await printConfigMenu();
      break;
    case CONFIG.DELETE_CREDENTIALS_OPT:
      await ConfigService.askToDeleteCredentials();
      await printConfigMenu();
      break;
    case CONFIG.BACK_OPT:
      await printMainMenu();
      break;
    case CONFIG.OPEN_FILE:
      await ConfigService.openConfigFile();
      await printConfigMenu();
      break;
    case CONFIG.OPEN_GOOGLE_FILE:
      await ConfigService.openConfigFile(ConfigConstants.GOOGLE_AUTH_STORE);
      await printConfigMenu(true);
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
    case MENU.CONFIG_OPT:
      return await printConfigMenu();
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

    await printMainMenu(true);
  } catch(e) {
    logger.error('Internal error: ', e);
  }


})();
