function response(res, message, status = 200) {
    let resp = {};

    if (!message) {
        return res.status(500).json({message:"Server Request fail"});
    }

    if (typeof message === "string") {
        resp = { message: message };
    } else {
        resp = message;
    }
    res.status(status).json(resp);
}

export default response;