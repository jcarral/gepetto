const config = require('./config');
const CONSTANTS = require('./constants');
const Credentials = require('./models/Credentials');


const getCredentials = () => {
    return config.get(CONSTANTS.CONFIG_CREDENTIAlS);
};

const hasCredentials = () => {
    const credentials = getCredentials();
    return credentials && credentials.length > 0;
};


const addCredentials = data => {
    const cred = new Credentials(data);

    if(cred.isValid()) {

        const oldCredentials = config.get(CONSTANTS.CONFIG_CREDENTIAlS);

        if(!oldCredentials || typeof oldCredentials === typeof []) {
            oldCredentials = [];
        }

        oldCredentials.push(cred);
        config.set(CONSTANTS.CONFIG_CREDENTIAlS, cred);

    } else {
        throw new Error('Invalid credentials');
    }
};


module.exports = {
    getCredentials,
    hasCredentials,
    addCredentials
};