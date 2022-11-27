import Base from "./Base.js";

class Payment extends Base{

    static collectionName = "payments";
    _id = undefined
    productId = undefined
    transactionId = ""
    buyerId = undefined
    orderId = undefined
    buyerEmail = ""
    price = ""
    createdAt = new Date()
    updatedAt = new Date()
    constructor(data) {
        super(Payment.collectionName)
        this.productId = data.productId
        this.transactionId = data.transactionId
        this.buyerId = data.buyerId
        this.orderId = data.orderId
        this.buyerEmail = data.buyerEmail
        this.price = data.price
    }
}


export default Payment;
