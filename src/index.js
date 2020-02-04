const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');


const { hasCredentials } = require('./store');

const checkForUpdates = () => {

};

const askForCredentials = async () => {


};


const printHeader = () => {
    clear();
    console.log(
        chalk.yellow(
            figlet.textSync('GePetto', {
                font: 'Alligator',
                horizontalLayout: 'full'
            })
        )
    );
};



(async () => {
    printHeader();


    if(!hasCredentials()) {
        await askForCredentials();
    }

})();


