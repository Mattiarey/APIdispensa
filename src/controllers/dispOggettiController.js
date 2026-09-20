import DispOggetti from '../entities/dispOggetti.js';

import { addOggDisp_model, getCasaByDispensa_model } from '../models/dispOggettiModel.js';
import { checkHomeRole_model } from '../models/homeModel.js'

export const addOggDisp = async (req, res) => {
    try {
        const idUtente = req.userId;
        const {
            fk_disp,
            fk_prodotto,
            scadenza,
            capacita_confezione,
            unita_misura,
            stato_consumo
        } = req.body;

        if (!fk_disp || !fk_prodotto) {
            return res.status(400).json({ error: "I campi fk_disp e fk_prodotto sono obbligatori." });
        }

        const idCasa = await getCasaByDispensa_model(fk_disp);
        
        if (!idCasa) {
            return res.status(404).json({ error: "Dispensa non trovata." });
        }

        const ruoloUtente = await checkHomeRole_model(idUtente, idCasa);
        if (!ruoloUtente) {
            return res.status(403).json({ error: "Accesso negato. L'utente non appartiene a questa casa." });
        }

        const nuovoOggetto = new DispOggetti({
            fk_prodotto,
            fk_disp,
            scadenza,
            capacita_confezione,
            unita_misura,
            stato_consumo
        });

        const result = await addOggDisp_model(nuovoOggetto);

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "Impossibile aggiungere l'oggetto alla dispensa." });
        }

        return res.status(201).json({ 
            success: true, 
            message: "Oggetto aggiunto alla dispensa",
            id_oggetto: result.insertId
        });

    } catch (err) {
        //console.error("Errore in addOggDisp:", error); perché no
        res.status(500).json({ error: err.message });
    }
}