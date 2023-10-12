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

// interface DatabaseType {
//     DATABASE_URL?:string
// }

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


const getStream = (req:any, res:any) =>{
    // put this in the env
    const url = `http://${STREAM_URL}:8000/stream.mjpg`
    console.log('starting fetch')
    fetch(url)
    .then(raspPiResponse => {
        // Pipe the response from Raspberry Pi to the client
        res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME');
        raspPiResponse.body.pipe(res);
        })
    .catch((err)=>console.log(err));
}
const moveServo = (req:any, res:Response) =>{
    // put this in the env
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
    sequelize.query(`
    INSERT INTO comments (name, content, date)
    VALUES('${name}','${content}', current_timestamp);
    `)
    .then((dbRes:any[]) => 
        {
            // console.log(JSON.stringify(dbRes))
        res.status(200).send(dbRes[0]);   
    })
}

const isItFeedingTime = ():Promise<boolean> =>{
    const date = new Date();
    const offset = -300; //Timezone offset for EST in minutes.
    const estDate = new Date(date.getTime() + offset*60*1000);
    console.log(estDate); //Gives Mon Mar 21 2016 23:00:00 GMT+0530 (IST)
    const response = new Promise<boolean>((resolve, reject)=>{
        const itIsTime = true
        if(itIsTime){
            resolve(true)
        }else{
            reject(false)
        }
    })
    return response
}

export {
    getStream,
    getComments,
    postComment,
    moveServo,
    isItFeedingTime
}