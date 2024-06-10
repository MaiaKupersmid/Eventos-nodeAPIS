import DetalleEvents from '../repositories/detalle_eventos-repository.js';

export default class DetalleService {
    getAllAsync = async (id) => {
        const repo = new DetalleEvents();
        const returnArray = await repo.getAllAsync(id);
        return returnArray;
    }
}
