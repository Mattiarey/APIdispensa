import { db } from '../config/db.js';
import Casa from '../entities/home.js';

/**
 * 
 * @returns tutte le case nel db
 */
export const getAllHomes_model = async () => {
    const [rows] = await db.query('SELECT * FROM casa');
    return rows;
}

export const newHome = async (casa, userId) => {
    // Richiediamo una singola connessione dal pool per garantire l'isolamento della transazione
    const connection = await db.getConnection(); 

    while (true) {
        try {
            // Inizio della transazione
            await connection.beginTransaction();

            // 1. Inserimento della nuova casa
            const queryCasa = "INSERT INTO casa (nome, slug, codice_invito) VALUES (?, ?, ?)";
            const [resultCasa] = await connection.query(queryCasa, [casa.nome, casa.slug, casa.code]);
            
            const casaId = resultCasa.insertId;

            // 2. Assegnazione dell'utente come 'owner'
            const queryMembri = "INSERT INTO membri_casa (utente_id, casa_id, ruolo) VALUES (?, ?, 'owner')";
            await connection.query(queryMembri, [userId, casaId]);

            // Se entrambe le query hanno successo, confermiamo la transazione
            await connection.commit();
            
            // Rilasciamo la connessione al pool
            connection.release();

            // Restituiamo i dati completi al controller
            return { 
                id: casaId, 
                ...casa, 
                ruolo_assegnato: 'owner' 
            };

        } catch (err) {
            // In caso di errore, annulliamo qualsiasi modifica fatta in questa transazione
            await connection.rollback();

            // Controllo per violazione di unicità (il codice invito esiste già)
            if (err.code === "ER_DUP_ENTRY") {
                // Rigeneriamo il codice e riproviamo il ciclo
                casa.code = Casa.generateInviteCode();
                continue; 
            }

            // Per qualsiasi altro errore critico, rilasciamo la connessione e interrompiamo
            connection.release();
            throw err;
        }
    }
}

export const getHomeSlCd_model = async (slug, code) => {
    let query = `
    SELECT 
    c.id AS casa_id, 
    c.nome AS casa_nome, 
    c.slug, 
    p.nome AS utente_nome, 
    p.mail AS utente_mail,
    m.ruolo
    FROM casa c
    LEFT JOIN membri_casa m ON c.id = m.casa_id
    LEFT JOIN persona p ON m.utente_id = p.id
    WHERE c.slug = ? AND c.codice_invito = ?;
    `;
    const [rows] = await db.query(query, [slug, code]);

    if (!rows || rows.length === 0) {
        return null; 
    }

    const casaInfo = {
        id: rows[0].casa_id,
        nome: rows[0].casa_nome,
        //slug: rows[0].slug,
        codice_invito: rows[0].codice_invito,
        // Filtriamo i membri: se utente_mail è null, la casa è vuota
        membri: rows[0].utente_mail 
            ? rows.map(row => ({
                nome: row.utente_nome,
                mail: row.utente_mail,
                ruolo: row.ruolo
            })) 
            : [] // Restituisce un array vuoto se non ci sono persone
    };

    return casaInfo;
}
export const checkHomeRole_model = async(idUtente, idCasa) => {
    let query = `
    select ruolo from membri_casa 
    where utente_id = ? and casa_id = ?;`;
    const [rows] = await db.query(query, [idUtente, idCasa]);
    if(!rows || rows.length === 0){
        return null;
    }
    const ruolo = rows[0].ruolo;
    return ruolo;
}

export const modifyHome_model = async(idCasa, datiDaModificare) => {
    const mapping = {
        nome: 'nome',
        slug: 'slug'
    };
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(datiDaModificare)){
        const dbColumn = mapping[key];
        
        // CRUCIALE: Escludiamo valori nulli, indefiniti o metodi
        if (dbColumn && value !== undefined && value !== null && typeof value !== 'function') {
            updates.push(`${dbColumn} = ?`);
            values.push(value);
        }
    }
    if(updates.length === 0) return { affectedRows: 0 };

    values.push(idCasa);

    const query = `UPDATE casa SET ${updates.join(', ')} WHERE id = ?`;
    
    const [result] = await db.execute(query, values);
    return result;
}
export const delHome_model = async(idCasa) => {
    let query = 'delete from casa where id = ?';
    const [result] = await db.execute(query, [idCasa]);
    return result;
}