const {
  QuestionConstants
} = require('../constants/');
const {
  MENU
} = QuestionConstants;

const Main = [{
  name: MENU.NAME,
  type: 'list',
  message: 'What do you want to do?',
  choices: [
    {
      name: 'Manage credentials',
      value: MENU.MANAGE_CREDENTIALS_OPT
    },
    {
      name: 'Select board',
      disabled: 'Unavailable at this time',
      value: MENU.BOARDS_OPT
    },
    {
      name: 'Close',
      value: MENU.CLOSE_OPT
    },
  ]
}, ];

module.exports = {
  Main,
}
