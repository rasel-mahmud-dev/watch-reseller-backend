import Base from "./Base.js";

class Wishlist extends Base{
    static collectionName = "wishlist";
    _id = undefined
    buyerId = undefined
    productId = undefined
    createdAt = new Date()
    updatedAt = new Date()
    constructor(data) {
        super(Wishlist.collectionName)
        this.productId = data.productId
        this.buyerId = data.buyerId
    }
}


export default Wishlist;
