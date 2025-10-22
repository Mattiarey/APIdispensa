import {db} from '../config/db.js';

export const getUsers = async () => {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
}