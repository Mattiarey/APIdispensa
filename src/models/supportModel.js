import { db } from '../config/db.js';
import {Marca, Oggetto_tipo, Dispensa_tipo, Prodotto} from '../entities/support.js';

export const getTipoDispensa_model = async() =>{
    let query = `select nome from disp_tipo order by nome asc`;
    const [rows] = await db.execute(query);
    return rows;
}
export const getTipoOggetti_model = async() =>{
    let query = `select nome from ogg_tipo order by nome asc`;
    const [rows] = await db.execute(query);
    return rows;
}
export const getMarche_model = async() =>{
    let query = `select nome from marca order by nome asc`;
    const [rows] = await db.execute(query);
    return rows;
}