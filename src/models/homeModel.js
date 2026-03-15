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
            return { id: result.insertId, ...casa}
        }
        catch (err) {
            if (err.code === "ERR_DUP_ENTRY") {
                continue;
            }
            throw err;
        }
    }
}