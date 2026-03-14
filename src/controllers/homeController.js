import Casa from '../entities/home.js'

import { getAllHomes_model } from '../models/homeModel.js';

export const getAllHomes = async(req, res) => {
    try{
        const homes = await getAllHomes_model();
        res.json(homes);
    }
    catch(err){
        res.status(500).json({ error: error.message })
    }
}