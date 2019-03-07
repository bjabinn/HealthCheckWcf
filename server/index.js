var express = require('express');
var path = require('path');
var app = express();


app.use(express.static('../services-chart/dist/services-chart'));


app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../services-chart/dist/services-chart/index.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
