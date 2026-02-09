// Classi 
import Persona from '../entities/user.js';

// Modelli
import {getUsers} from '../models/userModel.js';
import {newUser} from '../models/userModel.js';
import {get_user_safe} from '../models/userModel.js';
import {getUserById_model} from '../models/userModel.js';
import {modifyUser_model} from '../models/userModel.js';



export const getAllUsers = async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


/**
 * @requires Serve l'ID dell'utente da cercare
 * @returns Restituisce l'utente con l'ID specificato
 */
export const getUserById = async (req, res) => {
    try {
        // probabilmente non funzionerà .body
        const userId = req.body.id;
        let full_user = await getUserById_model(userId);
        res.json(full_user);
    }catch (error) {
        res.status(500).json({ error: error.message });
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



/**
 * 
 * Fare solo attenzione, client side, l'utente non faccia cagate: fare prima una query per prendere i dati attuali e poi modificare solo quelli che servono.
 * Inoltre siccome la password viene hashata, farla modificare in un altro modo.
 * @param {*} req Richiede l'id dell'utente e i campi da modificare.
 * @returns restituisce un messaggio di conferma
 */
export const modUser = async (req, res) => {
    try {
        const { id, password, ...altriDati } = req.body;

        if (!id) {
            return res.status(400).json({ error: "ID utente mancante" });
        }

        // 1. Creiamo l'istanza base con i dati "normali"
        // Usiamo lo spread operator per passare nome, cognome, email
        let utenteDaModificare = new Persona(altriDati);

        // 2. Gestione speciale per la password (se presente)
        if (password) {
            // Usiamo il tuo metodo statico per generare l'hash
            // Assumendo che create() restituisca una Persona con l'hash in .password
            const utenteConPass = await Persona.create({ 
                ...altriDati, 
                password 
            });
            utenteDaModificare.password = utenteConPass.password;
        }

        // 3. Chiamata al modello dinamico
        const result = await modifyUser_model(id, utenteDaModificare);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Utente non trovato o nessun dato modificato" });
        }

        res.json({ success: true, message: "Profilo aggiornato" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}