import BusquedaEvento from '../repositories/busqueda_evento-repository.js';

export default class Busqueda_evento {
    getByFilter = async (filters) => {
        const repo = new BusquedaEvento();
        const user = await repo.getByFilter(filters);
        return user;
    }
}