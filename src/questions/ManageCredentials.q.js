const { QuestionConstants } = require('../constants/');
const { CREDENTIALS } = QuestionConstants;


const ManageCredentials = [
  {
    name: CREDENTIALS.MANAGE_CREDENTIALS,
    type: 'list',
    message: '[Manage credentials] What do you want to do?',
    choices: [
      {
        name: 'View credentials',
        value: CREDENTIALS.VIEW_CREDENTIALS_OPT
      },
      {
        name: 'Add credentials',
        value: CREDENTIALS.ADD_CREDENTIALS_OPT
      },
      {
        name: 'Delete credentials',
        value: CREDENTIALS.DELETE_CREDENTIALS_OPT
      },
      {
        name: 'Back',
        value: CREDENTIALS.BACK_OPT
      },
    ]
  },
];

const AddCredentials = [
  {
    name: CREDENTIALS.ADD_DISPLAY_NAME,
    type: 'input',
    message: 'Enter credentials display name:',
    validateMessage: 'Please enter your credentials display name',
  },
  {
    name: CREDENTIALS.ADD_USERNAME,
    type: 'input',
    message: 'Enter your Jira username:',
    validateMessage: 'Please enter your Jira username',
  },
  {
    name: CREDENTIALS.ADD_HOST,
    type: 'input',
    message: 'Enter your Jira host:',
    validateMessage: 'Please enter your Jira host',
  },
  {
    name: CREDENTIALS.ADD_TOKEN,
    type: 'password',
    message: 'Enter your Jira token/password:',
    validateMessage: 'Please enter your Jira token/password',
  },
  {
    name: CREDENTIALS.ADD_BOARD,
    type: 'input',
    message: 'Enter your Jira board:',
    validateMessage: 'Please enter your Jira board',
  },
];

const DeleteCredentials = [
  {
    name: CREDENTIALS.DELETE,
    type: 'checkbox',
    message: 'Which credentials do you want to delete?',
    choices: [
    ]
  },
];


module.exports = {
  ManageCredentials,
  AddCredentials,
  DeleteCredentials
};
