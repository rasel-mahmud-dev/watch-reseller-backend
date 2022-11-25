const jwt = require('jsonwebtoken')


exports.createToken = (userId, role, email, expiresIn)=> {
    return jwt.sign({
            userId,
            role,
            email
        },
        process.env.JWT_SECRET, {expiresIn: expiresIn ? expiresIn : '7d'}
    )
}


exports.parseToken = (token)=> {
    return new Promise(async (resolve, reject)=>{
        try {
            if(token) {
                let d = await jwt.verify(token, process.env.JWT_SECRET)
                resolve(d)
            } else {
                reject(new Error("Token not found"))
            }
        } catch (ex){
            reject(ex)
        }
    })
}

