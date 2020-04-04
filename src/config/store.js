const Configstore = require('configstore');
const { ConfigConstants } = require('../constants');
const { logger } = require('../helpers');

class Store {
  constructor(name = ConfigConstants.DEFAULT_STORE){
    this.config = new Configstore(name, {fileName: name});
  }

  get(key){
    return this.config.has(key) ? this.config.get(key) : null;
  }

  set(key, value){
    this.config.set(key, value);
  }

  remove(key){
    if(this.config.has(key)){
      this.config.delete(key);
    }
  }

  has(key) {
    return this.config.has(key);
  }

  path(){
    return this.config.path;
  }
}

module.exports = Store;
