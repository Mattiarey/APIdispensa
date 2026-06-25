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