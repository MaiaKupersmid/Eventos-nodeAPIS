import { response } from "express";
import Jwt from "jsonwebtoken";
class AutenticationMddleware {
    AuthMiddleware = async (req, res, next) => {
        let authorizationHeader = req.headers.authorization; 
        let token = authorizationHeader.replace("Bearer ", "")
        const claveSecreta = "MaiuJuli_0607";
        try{
            let original = await Jwt.verify(token, claveSecreta);
            req.id_user = original.id;
            console.log(req.id_user)
            next();
        } catch(error){
            console.log(error)
            res.status(401);
        }
    }
}

export default new AutenticationMddleware