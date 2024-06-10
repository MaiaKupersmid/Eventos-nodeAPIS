import DBConfig from '../configs/db-config.js';
import pkg from 'pg'
const { Client, Pool }  = pkg;

getByIdUserCreatorAsync = async (limit, offset, id_user) => {
    let returnLoc = null;
    const client = new Client(DBConfig);
    await client.connect();
    try {
        const sql = `SELECT * FROM Public.event_locations WHERE id_creator_user = $3 LIMIT $1 OFFSET $2 `;
        const values = [limit, offset, id_user];
        const result = await client.query(sql, values);
        await client.end();
        returnLoc = result.rows;
    } catch (error) {
        console.log(error);
        returnLoc = null;
    }
    return returnLoc;
}