const fs = require('graceful-fs');
const readline = require('readline');
const {google} = require('googleapis');


// If modifying these scopes, delete token.json.
const SCOPES = [
'https://www.googleapis.com/auth/drive.metadata.readonly',
'https://www.googleapis.com/auth/drive.readonly', 
'https://www.googleapis.com/auth/drive.file', 
'https://www.googleapis.com/auth/drive',
'https://www.googleapis.com/auth/drive.apps.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'C:/google-credentials/token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles);
  authorize(JSON.parse(content), downloadFile);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 *
/** */

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);   
  });
}


/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
    
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

let fileId = "";

function listFiles(auth) {
  const drive =  google.drive({version: 'v3', auth});
    drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, function(err, res) {
    if (err) return console.log('The API returned an error: ' + err);
    let files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
      fileId = files[0].id;                      
      });
    } else {
      console.log('No files found.');
    };   
    downloadFile(auth);  
    setInterval(function(){repeat()}, 5000);  
  });
  
}

//Authorize the function to be used again
function autorizar(){
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), listFiles);
    authorize(JSON.parse(content), downloadFile);
  });
}

//Repeat the download of the file depending on the given time
function repeat(){
  setTimeout(autorizar, 5000);
  setTimeout(listFiles, 5000);
}



//Download the file from Google Drive
function downloadFile(auth) {
console.log("DOWNLOAD: ", fileId);
  
 let drive = google.drive({version: "v3", auth});
 var dest = fs.createWriteStream('C:/Users/dagarcma/Desktop/app/HealthCheckWcf/service-chart/src/assets/test.json');
 let read = fs.readFileSync('C:/Users/dagarcma/Desktop/app/HealthCheckWcf/service-chart/src/assets/test.json','utf8', (err, contents) => {
  if (err) throw err;  
  console.log(contents);
 }, downloadFile);


  drive.files.get({fileId: fileId, alt: "media"}, {responseType: "stream"},
  function(err, res){
      res.data
      .on("end", () => {
         console.log("Done");
      })
      .on("error", err => {
         console.log("Error", err);
      })
      .pipe(dest);  
  });


  var date = new Date();
  var current_hour = date.getHours();
  var i = 0;
  
  fs.appendFile('C:/Users/dagarcma/Desktop/historico/historia'+i+'.txt', read + "\r\n", function(err){
    if (err) throw err;
   });

   if(current_hour == 0)
   i++;


}

module.exports = {
  SCOPES,
  listFiles,
  downloadFile
};

