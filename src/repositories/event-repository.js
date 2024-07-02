import DBConfig from '../configs/db-config.js';
import pkg from 'pg'
const { Client, Pool }  = pkg;

export default class ListEvents {
    getByIdAsync = async (id) => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `SELECT
            json_build_object(
                'id', e.id,
                'name', e.name, 	
                'descripcion', e.description,
                'id_category', e.id_event_category,
                'id_location', e.id_event_location,
                'start_date', e.start_date,
                'duration_in_minutes', e.duration_in_minutes,
                'price', e.price,
                'enabled_for_enrollment', e.enabled_for_enrollment,
                'max_assistance', e.max_assistance,
                'id_creator_user', e.id_creator_user,
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
                    ),
                    'Category', json_build_object(
                        'id', cat.id,
                        'name'	, cat.name,
                        'display_order', cat.display_order
                    ),
                    --'juli', array(SELECT id FROM public.tags)
                
                    
                    'tags' , array(SELECT 
                                  json_build_object(
                                                  'id', tags.id,
                                                  'name', tags.name
                                   ) 
                          FROM public.tags
                          LEFT JOIN public.event_tags AS eventTags ON tags.id = eventTags.id_tag
                          WHERE eventTags.id_event = e.id
                     )
          )
          FROM public.events AS e
          LEFT JOIN public.event_categories AS cat ON e.id_event_category = cat.id
          LEFT JOIN public.event_locations AS Eloc ON e.id_event_location = Eloc.id
          LEFT JOIN public.users AS u ON e.id_creator_user = u.id
          LEFT JOIN public.locations AS loc ON Eloc.id_location = loc.id
          LEFT JOIN public.provinces AS prov ON loc.id_province = prov.id
          WHERE e.id = $1          
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

    getByFilter = async (filters, limit, offset) => {
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
            values.push('%' + filters.startdate + '%')
            i++;
        }
        if(filters.tag != null){
            miQuery += `AND lower(tag.name) like lower($${i}) `
            values.push('%' + filters.tag + '%')
            i++;
        }
        if(limit != null){
            miQuery += `LIMIT ($${i}) `
            values.push(filters.limit)
            i++;
        }
        if(offset != null){
            miQuery += `OFFSET ($${i}) `
            values.push(filters.offset)
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

    createAsync = async (entity) => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `INSERT INTO Public.events (
                name   ,
                description  ,
                id_event_category  ,
                id_event_location  ,
                start_date  ,
                duration_in_minutes  ,
                price  ,
                enabled_for_enrollment  ,
                max_assistance  ,
                id_creator_user  
                ) VALUES ($1,
                $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
            const values = [entity?.name    ??'',
            entity?.description    ??'',
            entity?.id_event_category    ??0,
            entity?.id_event_location    ??0,
            entity?.start_date    ??'',
            entity?.duration_in_minutes    ??0,
            entity?.price   ??0,
            entity?.enabled_for_enrollment    ??0,
            entity?.max_assistance    ??0,
            entity?.id_creator_user    ??0
        ]
            const result = await client.query(sql, values);
            await client.end();
            returnArray = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    }

    getByIdAsync = async (id) => {
        let returnCat = null;
        const client = new Client(DBConfig);
        await client.connect();
        try {
            const sql = `SELECT * FROM public.events WHERE id = $1`;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            returnCat = result.rows;
        } catch (error) {
            console.log(error);
            returnCat = null;
        }
        return returnCat;
    }

    updateAsync = async (entity) => {
        let returnArray = null;
        let id = entity.id;
        const client = new Client(DBConfig);
        try {
            const previousEntity = await this.getByIdAsync(id)
            if (previousEntity == null) { return 0;}

            await client.connect();
            const sql = `UPDATE public.events SET
                            name = $2  ,
                            description = $3 ,
                            id_event_category = $4 ,
                            id_event_location  = $5,
                            start_date  = $6,
                            duration_in_minutes = $7 ,
                            price  = $8,
                            enabled_for_enrollment = $9 ,
                            max_assistance  = $10,
                            id_creator_user  = $11
                WHERE id = $1`;
            const values = [
            entity?.id    ?? previousEntity?.id,
            entity?.name    ?? previousEntity?.name,
            entity?.description    ??previousEntity?.description,
            entity?.id_event_category    ??previousEntity?.id_event_category,
            entity?.id_event_location    ??previousEntity?.id_event_location,
            entity?.start_date    ??previousEntity?.start_date,
            entity?.duration_in_minutes    ??previousEntity?.duration_in_minutes,
            entity?.price   ??previousEntity?.price,
            entity?.enabled_for_enrollment    ??previousEntity?.enabled_for_enrollment,
            entity?.max_assistance    ??previousEntity?.max_assistance,
            entity?.id_creator_user    ??previousEntity?.id_creator_user
        ]
            const result = await client.query(sql, values);
            await client.end();
            returnArray = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    }

    deleteByIdAsync = async (id) => {
        let rowCount = 0;
        const client = new Client(DBConfig);
        await client.connect();
        try {
            const sqlEvents = 'DELETE FROM public.events WHERE id = $1';
            const valuesEvents = [id];
            const result = await client.query(sqlEvents, valuesEvents);
            await client.end();
            rowCount = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return rowCount; 
    };

    CreateEnrollmentAsync = async (idUser, idEvent, fecha) => {
        let rowCount = 0;
        const client = new Client(DBConfig);
        await client.connect();
        try {
            const sqlEvents = `INSERT INTO public.event_enrollments(
                id_event, id_user, registration_date_time
                )VALUES ($1, $2, $3);`
            const valuesEvents = [idEvent, idUser, fecha];
            const result = await client.query(sqlEvents, valuesEvents);
            await client.end();
            rowCount = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return rowCount; 
    }

    getEnrollmentAsync = async (id) => {
        let returnCount = 0;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `SELECT COUNT(*) as Cantidad FROM public.event_enrollments WHERE id_event = $1`;
            const values = [id];
            const result = await client.query(sql, values);
            console.log(result.rows[0])
            await client.end();
            returnCount = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return returnCount;
    }

    DeleteEnrollmentAsync = async (idUser, idEvent) => {
        let rowCount = 0;
        const client = new Client(DBConfig);
        await client.connect();
        console.log(idUser);
        console.log(idEvent);
        try {
            const sqlEvents = `DELETE FROM public.event_enrollments WHERE id_user = $2 AND id_event = $1;`
            const valuesEvents = [idEvent, idUser];
            const result = await client.query(sqlEvents, valuesEvents);
            await client.end();
            rowCount = result.rowCount;
            console.log(rowCount);
        } catch (error) {
            console.log(error);
        }
        return rowCount; 
    }
}
