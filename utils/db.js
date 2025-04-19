import mongoose from "mongoose"

import dotenv from "dotenv"

dotenv.config()


const db = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("connection to mongod SUCCESS")
        
    })
    .catch((err)=>{
        console.log("connection to mongodb is error")
    })
}

export default db;


