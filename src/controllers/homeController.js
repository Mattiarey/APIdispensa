import Casa from '../entities/home.js';

import { getAllHomes_model, getHomeSlCd_model } from '../models/homeModel.js';
import { newHome } from '../models/homeModel.js';

export const getAllHomes = async(req, res) => {
    try{
        const homes = await getAllHomes_model();
        res.json(homes);
    }
    catch(err){
        res.status(500).json({ error: err.message })
    }
}

export const createHome = async (req, res) => {
    try {
        const nome = req.body.nome;
        const nuova_casa = new Casa(nome);

        const result = await newHome(nuova_casa);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getHomeSlCd = async (req, res) => {
    try{
        const slug = req.body.slug;
        const code = req.body.codice_invito;
        const result = await getHomeSlCd_model(slug, code);
        res.status(201).json(result);
    }
    catch (err){
        res.status(500).json({error: err.message});
    }
}