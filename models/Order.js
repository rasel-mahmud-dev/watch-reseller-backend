import Base from "./Base.js";

class Order extends Base{
    static collectionName = "orders";
    _id = undefined
    productId = undefined
    sellerId = undefined
    buyerId = undefined
    title = ""
    price = ""
    phone = ""
    meetingAddress = ""
    isPaid = false
    createdAt = new Date()
    updatedAt = new Date()
    constructor(data) {
        super(Order.collectionName)
        this.productId = data.productId
        this.sellerId = data.sellerId
        this.buyerId = data.buyerId
        this.title = data.title
        this.isPaid = data.isPaid
        this.price = data.price
        this.phone = data.phone
        this.meetingAddress = data.meetingAddress
    }
}


export default Order;
