require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

var Vimeo = require('vimeo').Vimeo;

var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;
var ACCESS_TOKEN = process.env.ACCESS_TOKEN;

var client = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

const app = express();

app.use(fileUpload());

app.post('/upload', (req, res) => {
  if (!req.files) return res.status(400).send('No files were uploaded.');
  const file = req.files.file;
  const filePath = `./tmp/${file.name}`;

  fs.writeFile(filePath, file.data, (error) => {
    if (error) return res.status(400).send('Error uploading file');
    client.upload(
      filePath,
      {},
      function (uri) {
        fs.unlink(filePath, (err) => {
          if (err) res.status(400).send('Error uploading file');
          res.json({video: uri});
        });
      },
      function () {},
      function (error) {
        res.status(400).send('Error uploading file');
      }
    )
  });
});

app.listen(8000);
