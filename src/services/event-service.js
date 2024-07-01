import ListEvents from '../repositories/event-repository.js';

export default class EventsService {
    /*getAllAsync = async (limit, offset) => {
        const repo = new ListEvents();
        const returnArray = await repo.getAllAsync(limit, offset);
        return returnArray;
    }*/

    getByFilter = async (filters, limit, offset) => {
        const repo = new ListEvents();
        const user = await repo.getByFilter(filters, offset);
        return user;
    }

    getByIdAsync = async (id) => {
        const repo = new ListEvents();
        const returnArray = await repo.getByIdAsync(id);
        return returnArray;
    }

    createAsync = async (entity) => {
        const repo = new ListEvents();
        const returnArray = await repo.createAsync(entity);
        return returnArray;
    }

    updateAsync = async (entity) => {
        const repo = new ListEvents();
        const eve = await repo.updateAsync(entity);
        return eve;
    }

    deleteByIdAsync = async (id) => {
        const repo = new ListEvents();
        const eve = await repo.deleteByIdAsync(id);
        return eve;
    }

    createEnrollmentAsync = async (idUser, idEvent, fecha) => {
        const repo = new ListEvents();
        const eve = await repo.CreateEnrollmentAsync(idUser, idEvent, fecha);
        return eve;
    }
   
    getEnrollmentAsync = async (id) => {
        const repo = new ListEvents();
        const returnArray = await repo.getEnrollmentAsync(id);
        return returnArray;
    }
}
