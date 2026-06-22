import Casa from '../entities/home.js';

import { getAllHomes_model, getHomeSlCd_model, checkHomeRole_model, modifyHome_model } from '../models/homeModel.js';
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

// questa modifica deve essere possibile soltanto se si è owner o admin
export const modHome = async(req, res) => {
    try {
        // 1. Estrazione parametri sicuri
        const idCasa = req.body.id_casa; // O req.params.id, a seconda della tua rotta
        const idUtente = req.body.userId;     // Proviene dal middleware JWT (come in joinHome)
        const datiDaModificare = req.body.dati; // Es: { nome: "Nuovo Nome" }

        if (!idCasa || !datiDaModificare) {
            return res.status(400).json({ error: "ID casa e dati da modificare sono obbligatori." });
        }

        // 2. Verifica dei permessi (Interrogazione sicura al DB)
        // Questa funzione deve eseguire una SELECT su membri_casa filtrando per utente_id e casa_id
        const ruoloUtente = await checkHomeRole_model(idUtente, idCasa);

        if (!ruoloUtente) {
            return res.status(404).json({ error: "L'utente non appartiene a questa casa." });
        }

        if (ruoloUtente !== 'owner' && ruoloUtente !== 'admin') {
            return res.status(403).json({ error: "Azione negata. Sono richiesti privilegi di owner o admin." });
        }

        // 3. Esecuzione della modifica (simile a modUser)
        // Passiamo l'ID della casa e l'oggetto con i soli campi da aggiornare
        if(datiDaModificare.nome){
            datiDaModificare.slug = Casa.generateSlug(datiDaModificare.nome);
        }
        const result = await modifyHome_model(idCasa, datiDaModificare);

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "Nessuna modifica apportata. Verifica i dati." });
        }

        res.status(200).json({ success: true, message: "Impostazioni della casa aggiornate correttamente." });

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}