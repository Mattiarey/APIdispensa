import { db } from '../config/db.js';

export const addOggDisp_model = async(oggettoDispensa) => {
    const query = `
        INSERT INTO disp_oggetti (
            fk_prodotto, 
            fk_disp, 
            scadenza, 
            capacita_confezione, 
            unita_misura, 
            stato_consumo
        ) VALUES (?, ?, ?, ?, ?, ?);
    `;

    const values = [
        oggettoDispensa.fk_prodotto,
        oggettoDispensa.fk_disp,
        oggettoDispensa.scadenza,
        oggettoDispensa.capacita_confezione,
        oggettoDispensa.unita_misura,
        oggettoDispensa.stato_consumo
    ];

    const [result] = await db.execute(query, values);

    return result;
};

export const getCasaByDispensa_model = async (idDispensa) => {
    const query = `SELECT fk_casa FROM dispensa WHERE id = ?`;
    
    const [rows] = await db.execute(query, [idDispensa]);
    
    if (rows.length === 0) {
        return null;
    }
    
    return rows[0].fk_casa;
};