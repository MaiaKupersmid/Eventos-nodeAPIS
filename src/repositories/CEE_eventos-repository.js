import DBConfig from '../configs/db-config.js';
import pkg from 'pg'
const { Client, Pool }  = pkg;

export default class CEERepository {
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
        let returnCEE = null;
        const client = new Client(DBConfig);
        await client.connect();
        console.log(id);
        try {
            const sqlTags = 'DELETE FROM public.event_tags WHERE id_event = $1';
            const valuesTags = [id];
            const resultTags = await client.query(sqlTags, valuesTags);
            const sqlEvents = 'DELETE FROM public.events WHERE id = $1';
            const valuesEvents = [id];
            const resultEvents = await client.query(sqlEvents, valuesEvents);
            
            await client.end();
            returnCEE = resultEvents.rowCount
        } catch (error) {
            console.log(error);
            returnCEE = null;
        }
        return returnCEE; 
    };
    
}