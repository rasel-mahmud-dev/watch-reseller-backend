import mongoConnect from  "../services/database"

class Base {
    collectionName = "";
    static collectionName = "";

    constructor(collectionName) {
        // when call with new keyword extend classes...
        Base.collectionName = collectionName;
    }

    static databaseConnection;

    static Db(collection){
        return new Promise(async (resolve, reject) => {
            try {
                // use caching database client connection
                if (!Base.databaseConnection) {
                    Base.databaseConnection = await mongoConnect();
                }
                resolve(Base.databaseConnection.collection(collection));
            } catch (ex) {
                reject(ex);
            }
        });
    }

    save(){
        return new Promise(async (resolve, reject)=>{
            try{
                let {collectionName, ...other} = this
                let insertResult = await (await Base.Db(Base.collectionName)).insertOne(other)
                if(insertResult.insertedId){
                    other._id = insertResult.insertedId
                    resolve(other)
                } else {
                    resolve(null)
                }
            } catch (ex){
                reject(ex)
            }
        })
    }

    static get collection(){
        return Base.Db(this.collectionName)
    }

    static async find(...params) {
       return (await Base.Db(this.collectionName)).find(...params).toArray();
    }
    static async findOne(...params) {
        return (await Base.Db(this.collectionName)).findOne(...params)
    }

    static async deleteOne(filter) {
        return (await Base.Db(this.collectionName)).deleteOne(filter)
    }

    static async updateOne(filter, updateData, opt= {}) {
        return (await Base.Db(this.collectionName)).updateOne(filter, updateData, opt)
    }

    static async aggregate(pipelines) {
        return (await Base.Db(this.collectionName)).aggregate(pipelines).toArray();
    }
}

export default Base;
