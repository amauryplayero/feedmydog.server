import express from 'express';
import http from 'http';
import fs from 'fs'
import https from 'https'
import bodyParser from 'body-parser';
import cors from 'cors'; 
import {getStream, getComments, postComment, moveServo, isItFeedingTime} from './controller'

const app = express();
const port = 3001;
const https_options = {
 ca: fs.readFileSync("_.feedmydogservice.com_ssl_certificate_INTERMEDIATE.cer"),
 key: fs.readFileSync("_.feedmydogservice.com_private_key.key"),
 cert: fs.readFileSync("feedmydogservice.com_ssl_certificate.cer")
};

app.use(cors()); 
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/comments', postComment)
app.get('/comments', getComments)
app.get('/stream', getStream)
app.get('/move-servo', moveServo)
app.get('/feeding-time', isItFeedingTime)




https.createServer(https_options, function (req, res) {
  res.writeHead(200);
  res.end("Welcome to Node.js HTTPS Server")})
  .listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});