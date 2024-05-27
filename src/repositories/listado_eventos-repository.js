import DBConfig from '../configs/db-config.js';
import pkg from 'pg'
const { Client, Pool }  = pkg;

export default class ListEvents {
    getAllAsync = async (limit, offset) => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `SELECT 
            e.id, e.name, 
            e.description, 
            e.start_date, 
            e.duration_in_minutes, 
            e.price, 
            e.enabled_for_enrollment, 
            e.max_assistance,
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
        INNER JOIN public.event_categories AS cat ON e.id_event_category = cat.id
        INNER JOIN public.event_locations AS loc ON e.id_event_location = loc.id
        INNER JOIN public.users AS u ON e.id_creator_user = u.id
        LIMIT $1  
        OFFSET $2`;
            const values = [limit, offset];
            const result = await client.query(sql, values);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    }
}
