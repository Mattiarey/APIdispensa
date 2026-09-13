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
    const queryMembri = `
    SELECT 
    c.id AS casa_id, 
    c.nome AS casa_nome, 
    c.slug, 
    c.codice_invito,
    p.nome AS utente_nome, 
    p.mail AS utente_mail,
    m.ruolo
    FROM casa c
    LEFT JOIN membri_casa m ON c.id = m.casa_id
    LEFT JOIN persona p ON m.utente_id = p.id
    WHERE c.slug = ? AND c.codice_invito = ?;
    `;
    
    const [rows] = await db.execute(queryMembri, [slug, code]);

    if (!rows || rows.length === 0) {
        return null; 
    }

    const idCasa = rows[0].casa_id;

    const queryDispense = `
        SELECT 
            d.id as id_dispensa,
            d.nome AS nome_dispensa, 
            dd.nome AS tipo_dispensa 
        FROM dispensa d
        JOIN disp_tipo dd ON dd.id = d.fk_disp_tipo
        WHERE d.fk_casa = ?;
    `;
    const [dispenseRows] = await db.execute(queryDispense, [idCasa]);

    // 3. Assemblaggio dell'oggetto finale
    const casaInfo = {
        id: idCasa,
        nome: rows[0].casa_nome,
        codice_invito: rows[0].codice_invito,
        
        membri: rows[0].utente_mail 
            ? rows.map(row => ({
                nome: row.utente_nome,
                mail: row.utente_mail,
                ruolo: row.ruolo
            })) 
            : [],
            
        // Modifica qui: non restituiamo più solo stringhe, ma un array di oggetti ben definiti
        dispense: dispenseRows.map(dispensa => ({
            id: dispensa.id_dispensa,
            nome: dispensa.nome_dispensa,
            tipo: dispensa.tipo_dispensa
        }))
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

export const kick_model = async (idDaRimuovere, idCasa) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Recupera tutti i membri ordinati per data di ingresso (crescente)
        const queryMembri = `SELECT utente_id, ruolo FROM membri_casa WHERE casa_id = ? ORDER BY unito_il ASC`;
        const [membri] = await connection.query(queryMembri, [idCasa]);

        // 2. Verifica se l'utente da rimuovere è effettivamente nella casa
        const utenteDaRimuovere = membri.find(m => m.utente_id === idDaRimuovere);
        if (!utenteDaRimuovere) {
            await connection.rollback();
            connection.release();
            return { action: 'not_found' };
        }

        // 3. Se l'utente da rimuovere è l'UNICO membro rimasto, si elimina l'intera casa
        if (membri.length === 1) {
            const queryDeleteCasa = `DELETE FROM casa WHERE id = ?`;
            await connection.query(queryDeleteCasa, [idCasa]);
            
            await connection.commit();
            connection.release();
            return { action: 'deleted_home' };
        }

        // 4. Ci sono altri membri. Se l'utente rimosso era l'owner, passiamo il ruolo al più anziano
        if (utenteDaRimuovere.ruolo === 'owner') {
            const nuovoOwner = membri.find(m => m.utente_id !== idDaRimuovere);
            const queryPromote = `UPDATE membri_casa SET ruolo = 'owner' WHERE utente_id = ? AND casa_id = ?`;
            await connection.query(queryPromote, [nuovoOwner.utente_id, idCasa]);
        }

        // 5. Eliminiamo l'utente dalla tabella membri_casa
        const queryDeleteUtente = `DELETE FROM membri_casa WHERE utente_id = ? AND casa_id = ?`;
        await connection.query(queryDeleteUtente, [idDaRimuovere, idCasa]);

        await connection.commit();
        connection.release();
        return { action: 'removed' };

    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
}