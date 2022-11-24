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

    static deleteOne(filter){
        // Base.Db(this.collectionName).deleteOne(filter)
        // return
    }
}

export default Base;
