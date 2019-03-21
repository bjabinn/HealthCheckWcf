var express = require('express');
var path = require('path');
var app = express();
const googleApi = require("./googledrive");


const PORT = 3000;

app.use(express.static('public'));


app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get("/api", (req,res)=>{
  googleApi.listFiles()
  res.sendStatus(200);
});


app.listen(PORT, function () {
  console.log(`Example app listening localhost:${PORT}`);
});


