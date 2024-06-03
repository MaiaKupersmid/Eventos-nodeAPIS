import Jwt from "jsonwebtoken";
class AutenticationMddleware {
    AuthMiddleware = async (req, res, next) => {
        let authorizationHeader = req.headers.authorization; 
        let token = authorizationHeader.replace("Bearer ", "")
        const claveSecreta = "MaiuJuli_0607";
        let original = await Jwt.verify(token, claveSecreta);
        req.id_user = original.id;
        next();
    }
}

export default new AutenticationMddleware