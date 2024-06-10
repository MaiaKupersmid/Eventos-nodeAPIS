import {Router} from 'express';
import LocationsService from '../services/ubicaciones_eventos-service.js'
import AutenticationMddleware from './../middlewares/autentication-middleware.js';

import { parse } from 'dotenv';
import jwt from 'jsonwebtoken';
const router = Router();
const svc = new LocationsService();

const claveSecreta = "MaiuJuli_0607"

router.get('',  AutenticationMddleware.AuthMiddleware, async (req, res) => {
    let  limit = req.query.limit;
    let offset = req.query.offset;
    let id_user = req.id_user;
    console.log(id_user);
    let respuesta;
    limit = parseInt(limit);
    offset= parseInt(offset);
    if (isNaN(limit) && isNaN(offset)){
        console.log("error")
        res.status(500).send("no es un numero");
    } else {
        const returnArray = await svc.getAllAsync(limit, offset, id_user);
        if (returnArray != null){
            respuesta = res.status(200).json(returnArray);
        } else {
            respuesta = res.status(500).send(`Error interno.`);
        }
        return respuesta;
    }
});