const { QuestionConstants } = require('../constants');
const { CONFIG } = QuestionConstants;


const MainConfigMenuQuestions = [
  {
    name: CONFIG.MENU,
    type: 'list',
    message: '[Config] What do you want to do?',
    choices: [
      {
        name: 'View jira credentials',
        value: CONFIG.VIEW_CREDENTIALS_OPT
      },
      {
        name: 'Add jira credentials',
        value: CONFIG.ADD_CREDENTIALS_OPT
      },
      {
        name: 'Delete jira credentials',
        value: CONFIG.DELETE_CREDENTIALS_OPT
      },
      {
        name: 'Open jira credentials file',
        value: CONFIG.OPEN_FILE
      },
      {
        name: 'Open google auth credentials file',
        value: CONFIG.OPEN_GOOGLE_FILE
      },
      {
        name: 'Back',
        value: CONFIG.BACK_OPT
      },
    ]
  },
];

const AddCredentialsQuestions = [
  {
    name: CONFIG.ADD_DISPLAY_NAME,
    type: 'input',
    message: 'Enter credentials display name:',
    validateMessage: 'Please enter your credentials display name',
  },
  {
    name: CONFIG.ADD_USERNAME,
    type: 'input',
    message: 'Enter your Jira username:',
    validateMessage: 'Please enter your Jira username',
  },
  {
    name: CONFIG.ADD_HOST,
    type: 'input',
    message: 'Enter your Jira host:',
    validateMessage: 'Please enter your Jira host',
  },
  {
    name: CONFIG.ADD_TOKEN,
    type: 'password',
    message: 'Enter your Jira token/password:',
    validateMessage: 'Please enter your Jira token/password',
  },
  {
    name: CONFIG.ADD_BOARD,
    type: 'input',
    message: 'Enter your Jira board:',
    validateMessage: 'Please enter your Jira board',
  },
];

const DeleteCredentialsQuestions = [
  {
    name: CONFIG.DELETE,
    type: 'checkbox',
    message: 'Which credentials do you want to delete?',
    choices: [
    ]
  },
];


module.exports = {
  MainConfigMenuQuestions,
  AddCredentialsQuestions,
  DeleteCredentialsQuestions
};
