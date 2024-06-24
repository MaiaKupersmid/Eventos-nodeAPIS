import DBConfig from '../configs/db-config.js';
import pkg from 'pg'
const { Client, Pool }  = pkg;

export default class BusquedaEvento {
    getByFilter = async (filters) => {
        let returnEntity = null;
        const client = new Client(DBConfig);
        const values = [];
        let i = 1;
        await client.connect();
        let miQuery = `SELECT 
                                e.id, e.name, 
                                e.description, 
                                e.start_date, 
                                e.duration_in_minutes, 
                                e.price, 
                                e.enabled_for_enrollment, 
                                e.max_assistance,
                                tag.name AS tags,
                                json_build_object( 
                                    'nombre'	, u.first_name, 
                                    'apellido' 	,  u.last_name
                                ) AS usuario,
                                json_build_object(
                                    'categoria'	, cat.name
                                ) AS Categoria,
                                json_build_object(
                                    'locacion'	, loc.name, 
                                    'direccion'	, loc.full_address, 
                                    'longitud'	, loc.longitude, 
                                    'latitud'	, loc.latitude
                                ) AS Loc
                            FROM public.events AS e
                            LEFT JOIN public.event_categories AS cat ON e.id_event_category = cat.id
                            LEFT JOIN public.event_locations AS loc ON e.id_event_location = loc.id
                            LEFT JOIN public.users AS u ON e.id_creator_user = u.id
                            LEFT JOIN public.event_tags AS eventTags ON e.id = eventTags.id_event
                            LEFT JOIN public.tags AS tag ON eventTags.id = tag.id
                        WHERE 1 = 1 `
        if(filters.name != null){
            miQuery += `AND lower(e.name) like lower($${i}) `
            values.push('%' + filters.name + '%')
            i++;
        }
        if(filters.category != null){
            miQuery += `AND lower(cat.name) like lower($${i}) `
            values.push('%' + filters.category + '%')
            i++;
        }
        if(filters.startdate != null){
            miQuery += `AND e.start_date = $${i} `
            values.push(filters.startdate)
            i++;
        }
        if(filters.tag != null){
            miQuery += `AND lower(tag.name) like lower($${i}) `
            values.push('%' + filters.tag + '%')
            i++;
        }
        try {
            const sql = miQuery             
            const result = await client.query(sql, values);
            await client.end();
            returnEntity = result.rows;
        } catch (error) {
            console.log(error);
            returnEntity = false;
        }
        return returnEntity;
    }
}