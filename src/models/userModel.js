import { db } from '../config/db.js';
import Persona from '../entities/user.js';

/**
 * s
 * @returns Tutti gli utenti nel db
 */
export const getUsers = async () => {
    const [rows] = await db.query('SELECT * FROM persona');
    return rows;
}



/**
 * 
 * @param {*} persona 
 * @returns Valori inseriti
 */
export const newUser = async (persona) => {
    const [result] = await db.query('INSERT INTO persona (nome, cognome, mail, password_hash) VALUES (?, ?, ?, ?)',
        [persona.nome, persona.cognome, persona.email, await persona.password]);
    return { id: result.insertId, ...persona, password: await persona.password };
}



/**
 * Questa funzione, in se per se, non è sicura. Bisogna rilasciare un token insieme all'id
 * @param {*} credentials 
 * @returns id dell'utente, oppure messaggio di errore
 */
export const get_user_safe = async (credentials) => {
    const [rows] = await db.query('SELECT * FROM persona WHERE mail = ?', credentials.email);

    var ret_value = "Utente non trovato";

    if (rows.length === 1) {
        const user_data = rows[0];
        var user = Persona.createSafe(user_data);
        //var check = await bcrypt.compare(credentials.password_hash, user.password_hash);
        var check = await user.verifica_password(credentials.password);
        if (check) {
            const [id] = await db.query('SELECT * FROM persona WHERE mail = ?', credentials.email);
            ret_value = id[0].id;
        } else {
            ret_value = "Password errata";
        }
    }
    return ret_value;
}



export const getUserById_model = async (userId) => {
    const [rows] = await db.query('SELECT * FROM persona WHERE id = ?', userId);
    var ret_value = "Utente non trovato"
    if (rows.length === 1) {
        ret_value = Persona.createSafe(rows[0]);
    } 
    return ret_value;
}



export const modifyUser_model = async (userId, campi_da_modificare) => {
    const [result] = await db.query('UPDATE persona SET nome = ?, cognome = ?, mail = ?, password_hash = ? WHERE id = ?',
        [campi_da_modificare.nome, campi_da_modificare.cognome, campi_da_modificare.email, await campi_da_modificare.password, userId]);
    
}