import response from "../response";
import { parseToken } from "../jwt";
import getCookie from "../utils/getCookie";


function auth(req, res, next) {
    let token = getCookie("token", req);

    if (!token) {
        req.user = null;
        return response(res, "Please login first", 404);
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
            response(res, "Authorization, Please login first", 404);
        });
}

export default auth
