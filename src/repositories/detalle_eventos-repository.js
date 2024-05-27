import DBConfig from '../configs/db-config.js';
import pkg from 'pg'
const { Client, Pool }  = pkg;

export default class DetalleEvents {
    getAllAsync = async (id) => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `SELECT
            json_build_object(
                'id', e.id,
                   'name', e.name, 	
                    ----- TODO EVENTS 	
                'Event_Location', json_build_object(
                    'id', Eloc.id,
                    'id_locacion', Eloc.id_location,
                    'max_capacity', Eloc.max_capacity,
                    'locacion'	, Eloc.name, 
                    'direccion'	, Eloc.full_address, 
                    'longitud'	, Eloc.longitude, 
                    'latitud'	, Eloc.latitude,
                    'id_creator_user', Eloc.id_creator_user,
                    'location', json_build_object(
                        'id', loc.id,
                        'nombre', loc.name,
                        'id_province', loc.id_province,
                        'longitud'	, loc.longitude, 
                        'latitude'	, loc.latitude,
                        'province', json_build_object(
                            'id', prov.id,
                            'nombre', prov.name,
                            'full_name', prov.full_name,
                            'longitud'	, prov.longitude, 
                            'latitud'	, prov.latitude,
                            'display_order', prov.display_order
                        )
                    ) 
                ),
                'Creator_user', json_build_object( 
                    'id', u.id,
                    'nombre', u.first_name, 
                    'apellido',  u.last_name,
                    'username', u.username,
                    'password', '******'
                )
            ),
                json_build_object(
                    'id', cat.id,
                    'categoria'	, cat.name,
                    'display_order', cat.display_order
                ) AS Categoria
            FROM public.events AS e
            INNER JOIN public.event_categories AS cat ON e.id_event_category = cat.id
            INNER JOIN public.event_locations AS Eloc ON e.id_event_location = Eloc.id
            INNER JOIN public.users AS u ON e.id_creator_user = u.id
            INNER JOIN public.locations AS loc ON Eloc.id_location = loc.id
            INNER JOIN public.provinces AS prov ON loc.id_province = prov.id
            WHERE e.id = 8
            `;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    }
}
