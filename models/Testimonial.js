import Base from "./Base.js";

class Testimonial extends Base{
    static collectionName = "testimonials";
    _id = undefined
    rate = 0
    text = ""
    customerName= ""
    customerAvatar= ""
    createdAt = new Date()
    updatedAt = new Date()
    constructor(data) {
        super(Testimonial.collectionName)
        this.rate = data.rate
        this.text = data.text
        this.customerName = data.customerName
        this.customerAvatar = data.customerAvatar
    }
}


export default Testimonial;
