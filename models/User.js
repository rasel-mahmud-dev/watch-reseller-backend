import Base from "./Base";

class User extends Base{

    static collectionName = "users";
    _id = undefined
    googleId = ""
    firstName = ""
    lastName = ""
    username = ""
    avatar = ""
    role = ""
    phone = ""
    email = ""
    address= ""
    location = ""
    isVerified = false
    createdAt = new Date()
    updatedAt = new Date()

    constructor(data) {
        super(User.collectionName)
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.username = data.username
        this.email = data.email
        this.isVerified = false
        this.address = data.address
        this.location = data.location
        this.phone = data.phone
        this.avatar = data.avatar
        this.googleId = data.googleId
        this.role = data.role
    }
}


export default User;
