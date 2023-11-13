import express from 'express';
import fs from 'fs'
import https from 'https'
import http from 'http'
import bodyParser from 'body-parser';
import cors from 'cors'; 
import path from 'path';
import {getStream, getComments, postComment, moveServo, lastTimePattyAte} from './controller'


const app = express();
const port = 3001;
const server = http.createServer(app);

const https_options = process.env.ENVIRONMENT === 'dev' ? null : {
 ca: fs.readFileSync(path.resolve('_.feedmydogservice.com_ssl_certificate_INTERMEDIATE.pem')),
 key: fs.readFileSync(path.resolve('_.feedmydogservice.com_private_key.pem')),
 cert: fs.readFileSync(path.resolve('feedmydogservice.com_ssl_certificate.pem')),
};

if(process.env.ENVIRONMENT !== 'dev'){
  app.use(cors({
    origin: ['https://www.feedmydog.vercel.app', 'https://feedmydog.vercel.app', 'https://www.feedmydog.vercel.app:3001', 'https://feedmydog.vercel.app:3001']
  })); 
} else {
  app.use(cors())
}

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/comments', postComment)
app.get('/comments', getComments)
app.get('/stream', getStream)
app.get('/move-servo', moveServo)
app.get('/lastTimePattyAte', lastTimePattyAte)





if( process.env.ENVIRONMENT !== 'dev' || process.env.ENVIRONMENT === undefined){
  https.createServer(https_options, app).listen(port, () => {
  return console.log(`Express is listening at https://localhost:${port}`)}
  );
}else{
  server.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}
