import {db} from '../config/db.js';
import Persona from '../entities/user.js';


/**
 * s
 * @returns Tutti gli utenti nel db
 */
export const getUsers = async () => {
    const [rows] = await db.query('SELECT * FROM persona');
    return rows;
}
export const newUser = async (persona) => {
    const user = new Persona(persona);
    const [result] = await db.query('INSERT INTO persona (nome, cognome, mail, password_hash) VALUES (?, ?, ?, ?)',
        [user.nome, user.cognome, user.email, await user.password]);
    return { id: result.insertId, ...persona, password: await user.password };
}