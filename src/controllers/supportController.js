import {Marca, Oggetto_tipo, Dispensa_tipo, Prodotto} from '../entities/support.js';

import { getTipoDispensa_model, getTipoOggetti_model, getMarche_model } from '../models/supportModel.js';

export const getTipoDispensa = async(req, res) =>{
    try{
        const result = await getTipoDispensa_model();
        res.status(201).json(result);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getTipoOggetti = async(req, res) =>{
    try{
        const result = await getTipoOggetti_model();
        res.status(201).json(result);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMarche = async(req, res) =>{
    try{
        const result = await getMarche_model();
        res.status(201).json(result);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};