import * as path from "path";

require("dotenv").config()

import express from "express"
import cors from 'cors'
import morgan from "morgan"

import router from "./routes";

const app = express()
app.use(express.json())
app.use(morgan("dev"))


const whitelist = [process.env.FRONTEND]
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {

        if(process.env.NODE_ENV === "development"){
            return callback(null, true)
        }

        if(whitelist.indexOf(origin) !== -1) {
            callback(null, true)

        } else {
            // no access
            callback(null, false)
        }
    }
}

app.use(cors(corsOptions))


app.get("/", (req, res)=>{
    res.sendFile(path.resolve("./views/index.html"))
})


// initialize all routes
app.use(router)


app.use((err, req, res, next)=>{
    let message = "Internal error, Please try again"
    if(err && err.message){
        message = err.message
    }
    res.status(500).json({message: message})
})


const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))
