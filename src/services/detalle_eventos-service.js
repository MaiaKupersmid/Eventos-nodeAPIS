import DetalleEvents from '../repositories/detalle_eventos-repository.js';

export default class DetalleService {
    getAllAsync = async () => {
        const repo = new DetalleEvents();
        const returnArray = await repo.getAllAsync(limit, offset);
        return returnArray;
    }
}
