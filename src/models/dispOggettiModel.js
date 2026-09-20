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

export const getOggetti_model = async(idCasa, filtri) => {
    let query = `
        SELECT 
            do.id AS id_oggetto,
            do.fk_disp AS id_dispensa,
            d.nome AS nome_dispensa,
            pc.id AS id_prodotto,
            pc.nome AS nome_prodotto,
            ma.nome AS nome_marca,
            DATE_FORMAT(do.scadenza, '%Y-%m-%d') AS scadenza,
            do.capacita_confezione,
            do.unita_misura,
            do.stato_consumo,
            do.data_inserimento
        FROM disp_oggetti do
        JOIN dispensa d ON do.fk_disp = d.id
        JOIN prodotto_catalogo pc ON do.fk_prodotto = pc.id
        LEFT JOIN marca ma ON pc.fk_marca = ma.id
        WHERE d.fk_casa = ?
    `;

    const values = [idCasa];

    if (filtri.dispensa_id) {
        query += ` AND do.fk_disp = ?`;
        values.push(filtri.dispensa_id);
    }

    if (filtri.stato) {
        query += ` AND do.stato_consumo = ?`;
        values.push(filtri.stato);
    }

    query += ` ORDER BY do.scadenza ASC`;

    const [rows] = await db.execute(query, values);
    return rows;
}