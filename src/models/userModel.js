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


/**
 * la pratica migliore da eseguire per una modifica è creare una query dinamica
 * In questo modo se si invia due volte la stessa password cambierà l'hash, però non è un così gran problema. È il male minore
 */
export const modifyUser_model = async (userId, campi_da_modificare) => {
    
    const mapping = {
        nome: 'nome',
        cognome: 'cognome',
        email: 'mail',
        password: 'password_hash'
    };
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(campi_da_modificare)){
        const dbColumn = mapping[key];
        
        // CRUCIALE: Escludiamo valori nulli, indefiniti o metodi
        if (dbColumn && value !== undefined && value !== null && typeof value !== 'function') {
            updates.push(`${dbColumn} = ?`);
            values.push(value);
        }
    }
    if(updates.length === 0) return { affectedRows: 0 };

    values.push(userId);

    const query = `UPDATE persona SET ${updates.join(', ')} WHERE id = ?`;
    
    const [result] = await db.execute(query, values);
    return result;
}


export const delUser_model = async (userId) => {
    const [result] = await db.query('DELETE FROM persona WHERE id = ?', userId);
    let check = result.affectedRows;
    let risultato = check == 1? "Utente eliminato": "Utente non trovato";
    return risultato;
}

export const joinHome_model = async (userId, slug, code, ruolo) => {
    // Il terzo punto interrogativo ora è per il ruolo
    const query = `
        INSERT INTO membri_casa (utente_id, casa_id, ruolo)
        SELECT ?, id, ?
        FROM casa
        WHERE slug = ? AND codice_invito = ?
    `;

    try {
        const [result] = await db.execute(query, [userId, ruolo, slug, code]);
        return result;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error("L'utente fa già parte di questa casa.");
        }
        throw error;
    }
};