import ListEvents from '../repositories/listado_eventos-repository.js';

export default class EventsService {
    getAllAsync = async (limit, offset) => {
        const repo = new ListEvents();
        const returnArray = await repo.getAllAsync(limit, offset);
        return returnArray;
    }
}
