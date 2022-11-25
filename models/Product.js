import Base from "./Base.js";

class Product extends Base{

    static collectionName = "products";
    _id = undefined
    sellerId = undefined
    categoryId = undefined
    title = ""
    location = ""
    isSold = false
    resalePrice = ""
    originalPrice = ""
    picture = ""
    phone = ""
    conditionType = ""  // can be enum = {"excellent", "good", "fair"}
    description = ""
    purchaseDate = ""
    createdAt = new Date()
    updatedAt = new Date()

    constructor(data) {
        super(Product.collectionName)
        this.title = data.title
        this.location = data.location
        this.isSold = false
        this.resalePrice = Number(data.resalePrice)
        this.originalPrice = Number(data.originalPrice)
        this.sellerId = data.sellerId
        this.categoryId = data.categoryId
        this.picture = data.picture
        this.phone = data.phone
        this.conditionType = data.conditionType
        this.description = data.description
        this.purchaseDate = data.purchaseDate
    }
}


export default Product;
