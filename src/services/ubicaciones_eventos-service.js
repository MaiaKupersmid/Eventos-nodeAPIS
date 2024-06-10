import EventRepository from '../repositories/ubicaciones_eventos-repository.js';

export default class LocationsService {
    getByIdUserCreatorAsync = async (limit, offset, id_user) => {
        const repo = new EventRepository();
        const event_loc = await repo.getByIdUserCreatorAsync(limit, offset, id_user);
        return event_loc;
    }
}