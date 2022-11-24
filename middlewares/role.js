import response from "../response";

function role(roles) {
    return function (req, res, next) {
       if(req.user && roles.includes(req.user.role)){
           next()
       } else {
           response(res, "UnAuthorized", 401)
       }
    }
}
export default role