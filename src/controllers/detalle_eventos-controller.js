import {Router} from 'express';
import DetalleService from '../services/detalle_eventos-service.js';
const router = Router();
const svc = new DetalleService();

router.get('/:id', async (req, res) => {
    let respuesta;
    let id = req.params.id;
    const event_detalle = await svc.getAllAsync(id)
    if (event_detalle != null){
        respuesta = res.status(200).json(event_detalle);
    } else {
        respuesta = res.status(404).send(`Not found.`);
    }
    return respuesta;
});

export default router;
