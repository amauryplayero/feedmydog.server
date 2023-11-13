import { Response, Request } from "express"
import { Sequelize,  } from 'sequelize'
import dotenv from 'dotenv'
import fetch, { Request as RequestFetch } from 'node-fetch'


dotenv.config({path: '.env'});
const DATABASE_URL:string = process.env.DATABASE_URL;
const STREAM_URL:string = process.env.STREAM_URL;

interface CommentReq extends Request {
    name:string,
    content: string
}


const sequelize = new Sequelize(DATABASE_URL,{
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {   
            rejectUnauthorized:false
        }
    },
  
})


interface IdbRes {
    dbRes:{
        image_uuid: string | null,
        image_s3_url: string | null
    }

}


const getStream = async (req:any, res:Response, next:any) =>{
    const url = `http://${STREAM_URL}:8000/stream.mjpg`
    console.log('sending stream')
    fetch(url)
    .then(raspPiResponse => {
        // Pipe the response from Raspberry Pi to the client
        res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME');
        return raspPiResponse.body.pipe(res);
        })
    .catch((err)=>res.status(400).send(err))
    
}
const moveServo = (req:any, res:Response) =>{
    const url = `http://${STREAM_URL}:8000/move-servo`
    fetch(url)
    .then(raspPiResponse => {
        // Pipe the response from Raspberry Pi to the client
        res.status(200).send(raspPiResponse.body);
        });
}

const getComments = (req:Request, res:Response) =>{
    sequelize.query(`
    SELECT * FROM comments;  
    `)
    .then((dbRes:any[]) => 
        {
            console.log('sent comments')
        res.status(200).send(dbRes[0]);   
    })
}

const postComment = (req:CommentReq, res:Response) =>{

    const {name, content} = req.body;
    const date = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
    console.log(date)
    sequelize.query(`
    INSERT INTO comments (name, content, date)
    VALUES('${name}','${content}', '${date}');
    `)
    .then((dbRes:any[]) => 
        {
        res.status(200).send(dbRes[0]);   
    })
}


const lastTimePattyAte = (req:Request, res:Response) =>{
    sequelize.query(`
    SELECT * from comments 
    ORDER BY comment_id DESC
    LIMIT 1;
    `).then((dbRes:any[])=>{
        res.status(200).send(dbRes[0][0].date); 
    })
}

export {
    getStream,
    getComments,
    postComment,
    moveServo,
    lastTimePattyAte,
}