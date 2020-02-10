const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const {
  Spinner
} = require('clui');

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

const { CredentialsService, JiraService, } = require('./services');

const printHeader = () => {
  clear();
  console.log(
    chalk.hex('#E4007C').bold(
      figlet.textSync('GePetto', {
        horizontalLayout: 'full'
      })
    )
  );
};

const printBoardMenu = async () => {
  let selectedBoard = await JiraService.askToSelectBoard();
  selectedBoard = await JiraService.loadBoard(selectedBoard);
  
};
const printManageCredentialsMenu = async (hideHeader) => {

  if (!hideHeader) {
    printHeader();
  }

  const manageCredentialsAction = new Action(CredentialsQuestions.ManageCredentialsQuestions);
  const manageCredentialsAnswer = await manageCredentialsAction.ask();

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
    default:
      break;
  }

};
const printMainMenu = async () => {
  printHeader();
  const menuAction = new Action(MenuQuestions.Main)
  const menuActionAnswer = await menuAction.ask();

  switch (menuActionAnswer[MENU.NAME]) {
    case MENU.MANAGE_CREDENTIALS_OPT:
      return await printManageCredentialsMenu();
    case MENU.BOARDS_OPT:
      return await printBoardMenu();
    case MENU.CLOSE_OPT:
      return process.exit(1);
    default:
      return;
  }
};




(async () => {

  printHeader();


  //await checkForUpdates();

  if (!CredentialsService.hasCredentials()) {
    await CredentialsService.askForCredentials();
  }

  await printMainMenu();

})();
