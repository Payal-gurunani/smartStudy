import dotenv from 'dotenv';
dotenv.config();
import { app } from './app.js';
import connectDb from './config/db.js';
const port =process.env.PORT || 5000;
connectDb().then(()=>{
    app.listen(port , ()=>{
        console.log("App listen you on",port);})

    app.on('error',(error)=>{
        console.log(`server error${error}`);
        throw error;
    })
})
.catch((error)=>{
    console.log("Connection failed",error);
    
})
