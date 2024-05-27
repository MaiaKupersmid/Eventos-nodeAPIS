import {Router} from 'express';
import LocationsService from '../services/event_locations-service.js'
import { parse } from 'dotenv';
import jwt from 'jsonwebtoken';
const router = Router();
const svc = new LocationsService();

const claveSecreta = "MaiuJuli_0607"

router.get('', async (req, res) => {
    let  limit = req.query.limit;
    let offset = req.query.offset;
    let respuesta;
    limit = parseInt(limit);
    offset= parseInt(offset);
    if (isNaN(limit) && isNaN(offset)){
        console.log("error")
        res.status(500).send("no es un numero");
    } else {
        const returnArray = await svc.getAllAsync(limit, offset);
        if (returnArray != null){
            respuesta = res.status(200).json(returnArray);
        } else {
            respuesta = res.status(500).send(`Error interno.`);
        }
        return respuesta;
    }
});

router.get('/:id', async (req, res) => {
    let respuesta;
    let id = req.params.id;
    const event_loc = await svc.getByIdAsync(id)
    if (event_loc != null){
        respuesta = res.status(200).json(event_loc);
    } else {
        respuesta = res.status(404).send(`Not found.`);
    }
    return respuesta;
});

router.get('/:id/location', async (req, res) => {
    let respuesta;
    let  limit = req.query.limit;
    let offset = req.query.offset;
    let id = req.params.id;
    let authorizationHeader = req.headers.authorization; 
    let token = authorizationHeader.replace("Bearer ", "")
    limit = parseInt(limit);
    offset= parseInt(offset);

    if (token) {
        if (isNaN(limit) && isNaN(offset)){
            console.log("error")
            res.status(500).send("no es un numero");
        } else {
            const event_loc = await svc.getByIdLocationAsync(limit, offset, id)
            if (event_loc != null){
                respuesta = res.status(200).json(event_loc);
            } else {
                respuesta = res.status(404).send(`Not found.`);
            }
        }
    } else {
        respuesta = res.status(401).send('Unauthorized');
    }
    return respuesta;
});

export default router;