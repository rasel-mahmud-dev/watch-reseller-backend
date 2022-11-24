import Base from "./Base.js";

class Category extends Base{

    static collectionName = "categories";
    _id = undefined
    name = ""
    picture = ""
    createdAt = new Date()
    updatedAt = new Date()

    constructor(data) {
        super(Category.collectionName)
        this.name = data.name
        this.picture = data.picture
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt

    }
}


export default Category;
