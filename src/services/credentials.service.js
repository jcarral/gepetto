const open = require('open');
const {
  CredentialsQuestions
} = require('../questions');
const {
  Credentials,
  Action
} = require('../models');
const {
  hasCredentials,
  addCredentials,
  getCredentials,
  removeCredentials,
  getFilePath
} = require('../config/credentials.config');
const {
  QuestionConstants
} = require('../constants');
const {
  CREDENTIALS
} = QuestionConstants;
const { logger } = require('../helpers');

const askForCredentials = async () => {

  const askForCredentialsAction = new Action(CredentialsQuestions.AddCredentialsQuestions);
  const answerCred = await askForCredentialsAction.ask();
  const cred = new Credentials(answerCred);

  if (cred.isValid()) {
    logger.warn(`Invalid credentials ${cred}`);
    addCredentials(cred);
  }
};

//TODO: Check if is empty and force user to add or close app
//TODO: After deleting credentials check again if is empty
const askToDeleteCredentials = async () => {

  const storedCredentials = getCredentials();

  const choices = storedCredentials.map(cred => ({
    name: cred.displayName,
    value: cred.displayName
  }));

  const askToDeleteAction = new Action(CredentialsQuestions.DeleteCredentialsQuestions);
  askToDeleteAction.setChoices(CREDENTIALS.DELETE, choices);

  const answerCred = await askToDeleteAction.ask();
  const credToRemove = answerCred[CREDENTIALS.DELETE];

  if (credToRemove.length) {
    credToRemove.forEach(cred => removeCredentials(cred));
  }

};

const viewAllCredentials = () => {
    const userCredentials = getCredentials();

    if(!userCredentials.length){
      logger.info('User has not credentials, cannot see an empty list');
    }
    userCredentials.forEach(cred => cred.print());


};

const openCredentialsFile = async () => {

  try {
    const path = getFilePath();

    if(path && path.length) {
      await open(path);
    } else {
      logger.warn(`Invalid credentials file path: ${path}`);
    }
  } catch(e) {
    console.log(' Cannot open file ');
    logger.error(e);
  }


};

module.exports = {
  askForCredentials,
  askToDeleteCredentials,
  viewAllCredentials,
  hasCredentials,
  getCredentials,
  openCredentialsFile
}
