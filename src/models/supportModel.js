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
export const getProdotti_model = async(idCasa, nomeProdotto) => {
    let query = `
    select p.nome as nome_prodotto,
     m.nome as marca,
      o.nome as tipo_oggetto,
       c.nome as nome_casa -- questo è opzionale e probabilmente lo toglierò
    from prodotto_catalogo p
    left join marca m on m.id = p.fk_marca
    left join ogg_tipo o on o.id = p.fk_ogg_tipo
    left join casa c on c.id = p.fk_casa
    where p.nome like ? and
    (fk_casa is null or fk_casa = ?)`;
    const [rows] = await db.execute(query, [nomeProdotto, idCasa]);
    return rows;
}