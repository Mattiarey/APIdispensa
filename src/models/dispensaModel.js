import { db } from '../config/db.js';
import Dispensa from '../entities/dispensa.js';

export const createDispensa_model = async (disp) => {

    let query = `
    insert into dispensa (nome, fk_casa, fk_disp_tipo)
    values (?, ?, ?)
    `
    const params = [
        disp.nome,
        disp.fk_casa,
        disp.fk_disp_tipo
    ];
    const [result] = await db.execute(query, params);
    return result;
};

export const getTipoDispensa_model = async (idCasa) => {

    let query = `
    select d.id as id, d.nome as nomeDispensa, t.nome as nomeTipo
    from dispensa d
    join disp_tipo t on t.id = d.fk_disp_tipo
    where d.fk_casa = ?;
    `
    const [result] = await db.execute(query, [idCasa]);
    return result;
}

export const modDispensa_model = async (idDispensa, datiDaModificare, nuovo_nome_dispensa) => {

    const query1 = `UPDATE dispensa SET nome = ? WHERE id = ?`;

    const [result1] = await db.execute(query1, [nuovo_nome_dispensa, idDispensa]);


    const mapping = {
        nome_tipo: 'nome'
    };
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(datiDaModificare)) {
        const dbColumn = mapping[key];

        if (dbColumn && value !== undefined && value !== null && typeof value !== 'function') {
            updates.push(`disp_tipo.${dbColumn} = ?`);
            values.push(value);
        }
    }
    if (updates.length === 0) {
        return {
            esito1: result1,
            esito2: { affectedRows: 0, changedRows: 0 }
        };
    }
    values.push(idDispensa);

    const query2 = `UPDATE disp_tipo JOIN dispensa ON dispensa.fk_disp_tipo = disp_tipo.id SET ${updates.join(', ')} WHERE dispensa.id = ?`;
    const [result2] = await db.execute(query2, values)

    return {
        esito1: result1,
        esito2: result2
    };
};

export const delDisp_model = async (idDispensa) => {
    const query = 'DELETE FROM dispensa where id = ?';
    const [result] = await db.execute(query, [idDispensa]);
    return result;
}