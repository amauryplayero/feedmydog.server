import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors'; 
import {getStream, getComments} from './controller'

const app = express();
const server = http.createServer(app);
const port = 3001;

app.use(cors()); 
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/comments', getComments)
app.get('/getStream', getStream)




server.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});