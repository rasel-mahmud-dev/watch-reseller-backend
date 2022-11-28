function getToken(req){
    return  req.headers["token"]
}

export default getToken