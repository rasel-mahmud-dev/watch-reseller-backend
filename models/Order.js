import Base from "./Base.js";

class Order extends Base{

    static collectionName = "orders";
    _id = undefined
    productId = undefined
    sellerId = undefined
    title = ""
    price = ""
    phone = ""
    meetingAddress = ""
    createdAt = new Date()
    updatedAt = new Date()
    constructor(data) {
        super(Order.collectionName)
        this.productId = data.productId
        this.sellerId = data.sellerId
        this.title = data.title
        this.price = data.price
        this.phone = data.phone
        this.meetingAddress = data.meetingAddress
    }
}


export default Order;
