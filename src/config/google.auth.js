const { google } = require('googleapis');
const readline = require('readline');

const Store = require('./store');
const { ConfigConstants } = require('../constants');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];


const getToken = async (client) => {
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await rl.question('Enter the code from that page here: ');
  rl.close();
  const token = await client.getToken(code);
  Store.set(ConfigConstants.GOOGLE_AUTH_TOKEN, token);
  return token;
};

//TODO: CHECK IF CREDENTIALS ARE STORED FIRST
const getClient = async () => {
  const { client_secret, client_id, redirect_uris } = Store.get(ConfigConstants.GOOGLE_AUTH_CREDENTIALS);
  let token = Store.get(ConfigConstants.GOOGLE_AUTH_TOKEN);

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if(!token || !token.length) {
    token = await getToken(oAuth2Client);
  }

  oAuth2Client.setCredentials(token);
  return oAuth2Client;

};


module.exports = {
  getClient,
};
