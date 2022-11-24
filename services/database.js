require("dotenv").config()

const MongoClient = require("mongodb").MongoClient;

const client = new MongoClient(process.env.MONGODB_URL);

let database;
function mongoConnect() {
    return new Promise(async (resolve, reject) => {
        const clientPromise = client.connect();
        try {
            // we use mongodb client caching
            if(!database) {
                database = (await clientPromise).db("watch-reseller");
            }
            resolve(database)
            console.log("database connected...")
        } catch (ex){
            reject(ex)
        }
    })
}


export default mongoConnect