import response from "../response";
import { parseToken } from "../jwt";
import getToken from "../utils/getToken";


function auth(req, res, next) {
    let token = getToken(req);

    if (!token) {
        req.user = null;
        return response(res, "Please login first", 401);
    }

    parseToken(token)
        .then((u) => {
            req.user = {
                userId: u.userId,
                email: u.email,
                role: u.role,
            };
            next();
        })
        .catch((err) => {
            req.user = null;
            response(res, "Authorization, Please login first", 401);
        });
}

export default auth
