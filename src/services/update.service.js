const request = require('request');
const path = require('path');
const Box = require("cli-box");
const chalk = require('chalk');
const {
  Spinner
} = require('clui');

const packagejson = require(path.join(__basedir, 'package.json'));


const doRequest = url => {

  const options = {
    url,
    headers: {
      'User-Agent': 'GePetto App'
    }
  }
  return new Promise(function (resolve, reject) {
    request(options, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  });
}

const getRemoteVersion = async () => {
    const path = `https://api.github.com/repos/${packagejson.repoAuthor}/${packagejson.name}/tags`;
    const result = await doRequest(path);
    if (typeof result === typeof [] && result.length) {
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
        remoteVersion: 'v0.1.2',
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

        return (parseInt(remoteVersion.split('.').join('')) ) > (parseInt(currentVersion.split('.').join('')) );
    } catch (e) {
        return false;
    }


}

const checkForUpdates = async () => {
  let updateSpinner = new Spinner('Checking for new updates...');
  updateSpinner.start();
  try {
    const versions = await getVersions();

    if(await hasExpired(versions)) {
      updateSpinner.stop(); //Stop before drawing box

      const boxToDraw = Box("35x2", {
        text: "🤘 New update is available, you should update it 🤘 \n $ npm update -g gepetto",
        stretch: true,
        autoEOL: true,
        vAlign: "top",
        hAlign: "center"
      });
      console.log(chalk.yellow(boxToDraw));
    }
  } catch(e) {
    console.log('Error checking', e)
  }
  updateSpinner.stop();
};

module.exports = {
    getVersions,
    requiresAnUpdate,
    hasExpired,
    checkForUpdates,
};
