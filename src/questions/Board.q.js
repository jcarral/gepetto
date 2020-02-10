const {
  QuestionConstants
} = require('../constants/');
const {
  BOARD
} = QuestionConstants;


const getPrevMonthDate = () => {
  let d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d;
}

const Main = [{
  name: BOARD.MAIN,
  type: 'list',
  message: 'Select one board',
  choices: []
}, ];


const LoadedBoard = [{
  name: BOARD.LOADED_BOARD,
  type: 'list',
  message: '[Loaded board] What do you want to do?',
  choices: [{
      name: 'View users',
      value: BOARD.VIEW_USERS
    },
    {
      name: 'View issues',
      value: BOARD.VIEW_ISSUES
    },
    {
      name: 'View logs',
      value: BOARD.VIEW_LOGS
    },
    {
      name: 'Refresh',
      value: BOARD.REFRESH_BOARD
    },
    {
      name: 'Back',
      value: BOARD.BACK
    },
  ]
}, ];

const QueryBoard = [
  {
    name : BOARD.START_DATE,
    message: 'Set start date',
    type: 'datetime',
    format: ['yyyy', '-', 'mm', '-', 'dd'],
    initial: getPrevMonthDate(),
  },
  {
    name : BOARD.END_DATE,
    message: 'Set last date',
    type: 'datetime',
    format: ['yyyy', '-', 'mm', '-', 'dd'],
    initial: new Date(),
  },
  {
    name : BOARD.AUTHOR,
    message: 'Choose author',
    type: 'list',
    choices: [
      {
        name: 'Search all',
        value: '',
    }]
  }
];

module.exports = {
  Main,
  LoadedBoard,
  QueryBoard,
}
