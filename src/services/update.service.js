const request = request('request');
const packagejson = require('../package.json');

const getRemoteVersion = async () => {
    const path = `https://api.github.com/repos/${packagejson.repoAuthor}/${packagejson.name}/${tags}`;
    const result = await request(path);

    if (typeof result === typeof [] && result.length > 0) {
        const lastTag = result[0];
        return lastTag.name;
    } else {
        return null;
    }
};

const isValidVersionObj = version => 
    !version 
    || typeof version !== typeof {} 
    || !version.currentVersion 
    || version.currentVersion.length === 0 
    || !version.remoteVersion 
    || version.remoteVersion.length === 0;


const getVersions = async () => {
    const currentVersion = packagejson.version;

    const remoteVersion = await getRemoteVersion();

    return {
        currentVersion,
        remoteVersion,
    };

};

const hasExpired = async (version) => {

    try {
        if (!isValidVersionObj) {
            version = await getVersions();
        }
    
        const currentVersion = version.currentVersion.replace('v', '');
        const remoteVersion = version.remoteVersion.replace('v', '');
    
        return (parseInt(remoteVersion.split('.').join(''))) > (parseInt(currentVersion.split('.').join('')));
    } catch (e) {
        return false;
    }


} 
const requiresAnUpdate = async (version) => {

    try {
        if (!isValidVersionObj) {
            version = await getVersions();
        }
    
        const currentVersion = version.currentVersion.replace('v', '');
        const remoteVersion = version.remoteVersion.replace('v', '');
    
        return (parseInt(remoteVersion.split('.').join('')) / 10) > (parseInt(currentVersion.split('.').join('')) / 10);
    } catch (e) {
        return false;
    }


}

const checkForUpdates = async () => {

};

module.exports = {
    getVersions,
    requiresAnUpdate,
    hasExpired,
    checkForUpdates,
};