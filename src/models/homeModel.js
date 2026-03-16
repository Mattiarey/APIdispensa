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

export const newHome = async (casa) => {
    while (true) {

        try {
            const [result] = await db.query("INSERT INTO casa (nome, slug, codice_invito) VALUES (?, ?, ?)",
                [casa.nome, casa.slug, casa.code]);
            return { id: result.insertId, ...casa }
        }
        catch (err) {
            if (err.code === "ERR_DUP_ENTRY") {
                continue;
            }
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