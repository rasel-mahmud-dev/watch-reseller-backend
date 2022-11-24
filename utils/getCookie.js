function getCookie(cookieName, req){
    let result = ""
    let cookies = req.headers.cookie && req.headers.cookie.split(";") || []
    for (const cookie of cookies) {
        let t = cookie.split("=")
        if(t[0]) {
            if (t[0].trim() === cookieName && t[1]) {
                result = t[1]
            }
        }
    }

    return result
}

export default getCookie