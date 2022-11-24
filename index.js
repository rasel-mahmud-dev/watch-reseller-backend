import Base from "./models/Base";

require("dotenv").config()

import express from "express"
import cors from 'cors'

import router from "./routes";

const app = express()
app.use(express.json())

const whitelist = [process.env.FRONTEND]
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {

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
    res.send("hello world")
})


// initialize all routes
app.use(router)


app.use((err, req, res, next)=>{
    res.status(500).json({message: err.message})
})


const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))
