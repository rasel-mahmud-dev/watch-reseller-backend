import Base from "./Base.js";

class Watch extends Base{

    static collectionName = "watches";
    _id = undefined
    title = ""
    location = ""
    isAvailable = true
    resalePrice = ""
    originalPrice = ""
    picture = ""
    conditionType = ""  // can be enum = {"excellent", "good", "fair"}
    mobileNumber = ""
    description = ""
    purchaseDate = ""
    createdAt = new Date()
    updatedAt = new Date()

    constructor(data) {
        super(Watch.collectionName)
        this.title = data.title
        this.location = data.location
        this.isAvailable = data.isAvailable
        this.resalePrice = Number(data.resalePrice)
        this.originalPrice = Number(data.originalPrice)
        this.picture = data.picture
        this.conditionType = data.conditionType
        this.mobileNumber = data.mobileNumber
        this.description = data.description
        this.purchaseDate = data.purchaseDate
    }
}


export default Watch;
