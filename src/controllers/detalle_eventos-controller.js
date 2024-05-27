import {Router} from 'express';
import DetalleEvents from '../services/detalle_eventos-service.js';
const router = Router();
const svc = new DetalleEvents();

router.get('', async (req, res) => {
    
});

export default router;
