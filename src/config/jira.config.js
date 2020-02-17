const Store = require('./store');
const Credentials = require('../models/JiraCredentials');
const { ConfigConstants } = require('../constants');
const { logger } = require('../helpers');

const getCredentials = () => {
    const storedCredentials = new Store().get(ConfigConstants.CONFIG_CREDENTIAlS);
    logger.info(storedCredentials, JSON.stringify(new Store()))
    return (storedCredentials || []).map(cred => new Credentials(cred));
};

const hasCredentials = () => {
    const credentials = getCredentials();
    return credentials && credentials.length > 0;
};


const addCredentials = data => {
    const cred = new Credentials(data);
    const store = new Store();

    if(cred.isValid()) {

        let oldCredentials = store.get(ConfigConstants.CONFIG_CREDENTIAlS);

        if(!oldCredentials || typeof oldCredentials !== typeof []) {
            oldCredentials = [];
        }

        oldCredentials.push(cred);
        store.set(ConfigConstants.CONFIG_CREDENTIAlS, oldCredentials);

    } else {
        throw new Error('Invalid credentials');
    }
};

const removeCredentials = key => {
  const store = new Store();
  const credentialsWithoutTarget = getCredentials().filter(cred => cred.displayName !== key);
  store.set(ConfigConstants.CONFIG_CREDENTIAlS, credentialsWithoutTarget);
};

const getFilePath = type => new Store(type).path();


module.exports = {
    getCredentials,
    hasCredentials,
    addCredentials,
    removeCredentials,
    getFilePath
};
