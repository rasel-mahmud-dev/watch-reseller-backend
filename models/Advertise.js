import Base from "./Base";

class Advertise extends Base{

    static collectionName = "advertise";
    _id = undefined
    productId = undefined
    createdAt = new Date()
    updatedAt = new Date()

    constructor(data) {
        super(Advertise.collectionName)
        this.productId = data.productId
    }
}


export default Advertise;
