const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const { Spinner } = require('clui');

const { QuestionConstants } = require('./constants/');
const { CREDENTIALS, MENU } = QuestionConstants;
const { hasCredentials, addCredentials, getCredentials, removeCredentials } = require('./store');
const { Action, Credentials } = require('./models/');
const { ManageCredentials, MenuQuestions, BoardQuestions } = require('./questions');

const checkForUpdates = () => {

};

const askForCredentials = async () => {

  const askForCredentialsAction = new Action(ManageCredentials.AddCredentials);
  const answerCred = await askForCredentialsAction.ask();
  const cred = new Credentials(answerCred);

  if(cred.isValid()){
    addCredentials(cred);
  }

};

const askToDeleteCredentials = async () => {
  const storedCredentials = getCredentials();

  const choices = storedCredentials.map(cred => ({
    name: cred.displayName,
    value: cred.displayName
  }));

  const askToDeleteAction = new Action(ManageCredentials.DeleteCredentials);
  askToDeleteAction.setChoices(CREDENTIALS.DELETE, choices);
  const answerCred = await askToDeleteAction.ask();
  const credToRemove = answerCred[CREDENTIALS.DELETE];

  if(credToRemove.length) {
    credToRemove.forEach(cred => removeCredentials(cred));
  }

};


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
  const selectBoardAction = new Action(BoardQuestions.Main);
  const storedCredentials = getCredentials();
  const choices = storedCredentials.map(cred => ({
    name: cred.displayName,
    value: cred.board
  }));
  selectBoardAction.setChoices(BoardQuestions.Main, choices);
  const res = await selectBoardAction.ask();
  console.log(res);
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
      break;
  }
};

const printManageCredentialsMenu = async (hideHeader) => {

  if(!hideHeader){
    printHeader();
  }

  const manageCredentialsAction = new Action(ManageCredentials.ManageCredentials);
  const manageCredentialsAnswer = await manageCredentialsAction.ask();

  switch (manageCredentialsAnswer[CREDENTIALS.MANAGE_CREDENTIALS]) {

    case CREDENTIALS.VIEW_CREDENTIALS_OPT:
      const userCredentials = getCredentials();
      userCredentials.forEach(cred => cred.print());
      await printManageCredentialsMenu(true);
      break;
    case CREDENTIALS.ADD_CREDENTIALS_OPT:
      await askForCredentials();
      await printManageCredentialsMenu();
      break;
    case CREDENTIALS.DELETE_CREDENTIALS_OPT:
      await askToDeleteCredentials();
      await printManageCredentialsMenu();
    case CREDENTIALS.BACK_OPT:
        await printMainMenu();
        break;
    default:
      break;
  }

};


(async () => {

    printHeader();

    if(!hasCredentials()) {
        await askForCredentials();
    }

    await printMainMenu();

})();


