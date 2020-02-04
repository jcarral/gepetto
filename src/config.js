const Configstore = require('configstore');
const CONSTANTS = require('./constants');

const config = new Configstore('ds');

const get = key => {
    return config.get(key);
}; 

const set = (key, value) => {
    config.set(key, value);
};

const remove = key => {
    config.delete(key);
};

module.exports = {
    get,
    set,
    remove
};