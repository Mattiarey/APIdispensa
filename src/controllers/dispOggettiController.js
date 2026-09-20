import DispOggetti from '../entities/dispOggetti.js';

import { addOggDisp_model, getCasaByDispensa_model, getOggetti_model } from '../models/dispOggettiModel.js';
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
};


const groupObjectsByProduct = (oggetti) => {
    const map = new Map();

    for (const item of oggetti) {
        if (!map.has(item.id_prodotto)) {
            map.set(item.id_prodotto, {
                id_prodotto: item.id_prodotto,
                nome_prodotto: item.nome_prodotto,
                marca: item.nome_marca,
                totale_confezioni: 0,
                istanze: []
            });
        }

        const gruppo = map.get(item.id_prodotto);
        gruppo.totale_confezioni += 1;
        
        // Inserimento dell'istanza fisica all'interno del gruppo
        gruppo.istanze.push({
            id_oggetto: item.id_oggetto,
            id_dispensa: item.id_dispensa,
            nome_dispensa: item.nome_dispensa,
            scadenza: item.scadenza,
            capacita_confezione: item.capacita_confezione,
            unita_misura: item.unita_misura,
            stato_consumo: item.stato_consumo
        });
    }

    return Array.from(map.values());
};


export const getOgggettiDispensa = async (req, res) => {
    try {
        const idUtente = req.userId;
        const idCasa = req.params.idCasa;

        const { dispensa_id, stato, groupby } = req.query;

        const ruoloUtente = await checkHomeRole_model(idUtente, idCasa);

        if (!ruoloUtente) {
            return res.status(404).json({ error: "L'utente non appartiene a questa casa." });
        }

        const filtri = {dispensa_id, stato};
        const oggetti = await getOggetti_model(idCasa, filtri);

        // così si gruppa per bene
        if (groupby === 'prodotto') {
            const groupedData = groupObjectsByProduct(oggetti);
            return res.status(200).json({ success: true, data: groupedData });
        }

        return res.status(200).json({ success: true, data: oggetti });

    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};

