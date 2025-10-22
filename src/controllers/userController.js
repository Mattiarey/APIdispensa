// Classi 
import Persona from '../entities/user.js';

// Modelli
import {getUsers} from '../models/userModel.js';
import {newUser} from '../models/userModel.js';
import {get_user_safe} from '../models/userModel.js';



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
        let nuova_persona = await Persona.create(personaData);
        let new_persona = await newUser(nuova_persona);

        // new_persona è utile in questa fase, ma non credo serva o sia sicuro mandarlo indietro
        res.status(201).json("User successfully created");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
/**
 * 
 * @param {*} req Richiede le credenziali che devono essere contenere mail e password
 * @param {*} res Se la richiesta va a buon fine restituisce l'ID dell'utente
 */
export const loginUser = async (req, res) => {
    try {
        const credentials = Persona.createCredentials(req.body);
        const result = await get_user_safe(credentials);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}