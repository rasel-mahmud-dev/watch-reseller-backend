import Base from "./Base";

class User extends Base{

    static collectionName = "users";
    _id =  ""
    googleId = ""
    firstName = ""
    lastName = ""
    username = ""
    avatar = ""
    password = ""
    role = ""
    phone = ""
    email = ""
    address= ""
    location = ""
    createdAt = new Date()
    updatedAt = new Date()

    constructor(data) {
        super(User.collectionName)
        let username = data.firstName + data.lastName ? " " + data.lastName : ""
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.username = data.username
        this.email = data.email
        this.avatar = data.avatar
        this.googleId = data.googleId
        this.password = data.password
        this.role = data.role
    }
}


export default User;
