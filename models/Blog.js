import Base from "./Base.js";

class Blog extends Base{
    static collectionName = "blogs";
    _id = undefined
    title = ""
    description = ""
    createdAt = new Date()
    updatedAt = new Date()
    constructor(data) {
        super(Blog.collectionName)
        this.title = data.title
        this.description = data.title
    }
}


export default Blog;
