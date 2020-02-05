const config = require('./config');
const CONSTANTS = require('./constants');
const Credentials = require('./models/Credentials');


const getCredentials = () => {
    const storedCredentials = config.get(CONSTANTS.CONFIG_CREDENTIAlS);
    return (storedCredentials || []).map(cred => new Credentials(cred));
};

const hasCredentials = () => {
    const credentials = getCredentials();
    return credentials && credentials.length > 0;
};


const addCredentials = data => {
    const cred = new Credentials(data);

    if(cred.isValid()) {

        let oldCredentials = config.get(CONSTANTS.CONFIG_CREDENTIAlS);

        if(!oldCredentials || typeof oldCredentials !== typeof []) {
            oldCredentials = [];
        }

        oldCredentials.push(cred);
        config.set(CONSTANTS.CONFIG_CREDENTIAlS, oldCredentials);

    } else {
        throw new Error('Invalid credentials');
    }
};

const removeCredentials = key => {
  const credentialsWithoutTarget = getCredentials().filter(cred => cred.displayName !== key);
  console.log(credentialsWithoutTarget, key)
  config.set(CONSTANTS.CONFIG_CREDENTIAlS, credentialsWithoutTarget);
};


module.exports = {
    getCredentials,
    hasCredentials,
    addCredentials,
    removeCredentials
};
