const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const boxen = require('boxen');

const printHeader = () => {
  clear();
  console.log(
    chalk.blue.bold(
      figlet.textSync('GePetto', {
        horizontalLayout: 'full'
      })
    )
  );
};


const colors = {
  'success': '#64DD17',
  'error': 'red',
  'info': 'cyan',
  'warn': '#FFFF00'
};


const notifyBox = type => (...messages) =>
  console.log('\n' + boxen(messages.join('\n'), {
    padding: 1,
    margin: 1,
    borderColor: colors[type],
    borderStyle: 'round',
  }) + '\n');

const Notify = {

  success : notifyBox('success'),
  error : notifyBox('error'),
  info: notifyBox('info'),
  warn: notifyBox('warn'),

}


module.exports = {
  printHeader,
  Notify,
}
