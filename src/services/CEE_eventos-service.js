import CEE_eventos from '../repositories/CEE_eventos-repository.js';

export default class CEEService {
    createAsync = async (entity) => {
        const repo = new CEE_eventos();
        const returnArray = await repo.createAsync(entity);
        return returnArray;
    }

    updateAsync = async (entity) => {
        const repo = new CEE_eventos();
        const eve = await repo.updateAsync(entity);
        return eve;
    }

    deleteByIdAsync = async (id) => {
        const repo = new CEE_eventos();
        console.log(id)
        const eve = await repo.deleteByIdAsync(id);
        return eve;
    }
}