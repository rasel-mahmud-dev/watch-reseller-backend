import Base from "./Base.js";

class Watch extends Base{

    static collectionName = "watches";
    _id = undefined
    title = ""
    location = ""
    isAvailable = false
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
        this.name = data.name
        this.price = Number(data.price)
        this.model = data.model
        this.image = data.image
        this.brand = data.brand
        this.userId = data.userId
        this.description = data.description
        this.attributes = data.attributes
    }
}


export default Watch;
