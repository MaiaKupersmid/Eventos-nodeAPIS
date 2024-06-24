import {Router} from 'express';
import Busqueda_evento from '../services/busqueda_evento-service.js';
const router = Router();
const svc = new Busqueda_evento();

router.get('', async (req, res) => {
    let respuesta;
    const filtros = req.query;

    const usarInicio = await svc.getByFilter(filtros)
    if (usarInicio != null){
        respuesta = res.status(200).json(usarInicio);
    } else {
        respuesta = res.status(401).send("NoOk");
    }
    return respuesta;
});

export default router;