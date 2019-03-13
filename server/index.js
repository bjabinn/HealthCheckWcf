var express = require('express');
var path = require('path');
var app = express();

const PORT = 3000;

app.use(express.static('public'));


app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, function () {
  console.log(`Example app listening localhost:${PORT}`);
});
