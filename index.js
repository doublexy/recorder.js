const express = require('express');
const path = require('path');
var fs = require('fs');
const http = require('http');

const app = express();
const staticPath=process.env.static ||'./';
const port=process.env.port || 8888;

const options = process.env.env == 'prod' ? {maxAge: '3d'} : {maxAge: '1m'};

app.use(express.static(path.join(__dirname, staticPath), options));

app.get('/', function(req, res, next) {
  res.render('index.html');
});

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
app.post('/upload',multipartMiddleware, function (req, res) {
  console.log(req.files.blob);
  var oldFile = req.files.blob.path;
  var newFile = path.join(__dirname, 'test.mp3');
  var readStream=fs.createReadStream(oldFile);
  var writeStream=fs.createWriteStream(newFile);
  readStream.pipe(writeStream);
  readStream.on('end',function(){
     fs.unlinkSync(oldFile);
  });
  res.send("post successfully!");
});

app.listen(port);
