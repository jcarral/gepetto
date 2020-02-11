const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

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

module.exports = {
  printHeader,
}
