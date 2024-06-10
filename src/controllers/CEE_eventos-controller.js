import {Router} from 'express';
import CEE_eventos from './../services/CEE_eventos-service.js'
import AutenticationMddleware from './../middlewares/autentication-middleware.js';
import { parse } from 'dotenv';
const router = Router();
const svc = new CEE_eventos();

const claveSecreta = "MaiuJuli_0607"

router.post('', AutenticationMddleware.AuthMiddleware, async (req, res) => {
    let respuesta;
    let newEve = req.body;
    const eve = await svc.createAsync(newEve)
    if (eve != null){
        respuesta = res.status(201).json("created");
    } else {
        respuesta = res.status(400).send(`Bad request.`);
    }
    return respuesta;
})

router.put('', AutenticationMddleware.AuthMiddleware, async (req, res) => {
    let respuesta;
    let  newEve = req.body;
    const eve = await svc.updateAsync(newEve)
    if (eve != null){
        respuesta = res.status(201).json("Succesfully");
    } else {
        respuesta = res.status(400).send(`Error interno.`);
    }
    return respuesta;
})

router.delete('/:id', AutenticationMddleware.AuthMiddleware, async (req, res) => {
    let respuesta;
    let id = req.params.id;
    const eve = await svc.deleteByIdAsync(id)
    console.log(eve)
    if (eve != null){
        respuesta = res.status(200).json("Eliminada");
    } else {
        respuesta = res.status(404).send(`Not Found.`);
    }
    return respuesta;
})

export default router;