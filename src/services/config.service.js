const open = require('open');
const {
  ConfigQuestions
} = require('../questions');
const {
 Action,
 JiraCredentials
} = require('../models');
const {
  hasCredentials,
  addCredentials,
  getCredentials,
  removeCredentials,
  getFilePath
} = require('../config/jira.config');
const {
  QuestionConstants
} = require('../constants');
const {
  CONFIG
} = QuestionConstants;
const { logger } = require('../helpers');

const askForCredentials = async () => {

  const askForCredentialsAction = new Action(ConfigQuestions.AddCredentialsQuestions);
  const answerCred = await askForCredentialsAction.ask();
  const cred = new JiraCredentials(answerCred);

  if (cred.isValid()) {
    logger.warn(`Invalid credentials ${cred}`);
    addCredentials(cred);
  }
};


const askToDeleteCredentials = async () => {

  const storedCredentials = getCredentials();

  const choices = storedCredentials.map(cred => ({
    name: cred.displayName,
    value: cred.displayName
  }));

  const askToDeleteAction = new Action(ConfigQuestions.DeleteCredentialsQuestions);
  askToDeleteAction.setChoices(CONFIG.DELETE, choices);

  const answerCred = await askToDeleteAction.ask();
  const credToRemove = answerCred[CONFIG.DELETE];

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

const openConfigFile = async type => {

  try {
    const path = getFilePath(type);
    console.log(path)
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
  openConfigFile
}
