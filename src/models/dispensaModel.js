import { db } from '../config/db.js';
import Dispensa from '../entities/dispensa.js';

export const createDispensa_model = async(disp) => {

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

export const getTipoDispensa_model = async(idCasa) => {

    let query = `
    select d.id as id, d.nome as nomeDispensa, t.nome as nomeTipo
    from dispensa d
    join disp_tipo t on t.id = d.fk_disp_tipo
    where d.fk_casa = ?;
    `
    const [result] = await db.execute(query, [idCasa]);
    return result;
}

export const modDispensa_model = async(idDispensa, datiDaModificare) => {
    const mapping = {
        nome: 'nome'
    };
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(datiDaModificare)){
        const dbColumn = mapping[key];
        
        if (dbColumn && value !== undefined && value !== null && typeof value !== 'function') {
            updates.push(`${dbColumn} = ?`);
            values.push(value);
        }
    }
    if(updates.length === 0) return { affectedRows: 0 };
    values.push(idDispensa);

    const query = `UPDATE dispensa SET ${updates.join(', ')} WHERE id = ?`;

    const [result] = await db.execute(query, values);
    return result;
}