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
      value: MENU.CONFIG_OPT
    },
    {
      name: 'Select Jira board',
      value: MENU.BOARDS_OPT
    },
    {
      name: 'Manage your calendar',
      value: MENU.CAL_OPT,
      disabled: 'Not available yet'
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
