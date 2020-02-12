const Configstore = require('configstore');

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

const path = () => config.path;

module.exports = {
    get,
    set,
    remove,
    path
};
