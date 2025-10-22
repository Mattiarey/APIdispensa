// Classi 
import Persona from '../entities/user.js';

// Modelli
import {getUsers} from '../models/userModel.js';
import {newUser} from '../models/userModel.js';



export const getAllUsers = async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}
export const createUser = async (req, res) => {
    try {
        const personaData = req.body;
        const nuova_persona = new Persona(personaData);
        const new_persona = await newUser(nuova_persona);
        res.status(201).json(new_persona);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}