import Dispensa from '../entities/dispensa.js';

import { createDispensa_model, getTipoDispensa_model, modDispensa_model, delDisp_model } from '../models/dispensaModel.js';
import { checkHomeRole_model } from '../models/homeModel.js';

export const createDispensa = async (req, res) => {
    try {
        const idUtente = req.userId;

        const nome = req.body.nomeDispensa;
        const fk_casa = req.body.idCasa;
        const fk_disp_tipo = req.body.idDispTipo;



        if (!fk_casa || !nome) {
            return res.status(400).json({ error: "Il nome del prodotto e l'ID della casa sono obbligatori." });
        }

        if (!idUtente) {
            return res.status(401).json({ error: "Utente non autenticato." });
        }

        const ruoloUtente = await checkHomeRole_model(idUtente, fk_casa);

        if (!ruoloUtente) {
            return res.status(403).json({ error: "Azione negata. L'utente non appartiene a questa casa." });
        }
        const disp = new Dispensa({
            nome: nome,
            fk_casa: fk_casa,
            fk_disp_tipo: fk_disp_tipo
        });

        const result = await createDispensa_model(disp);
        res.status(201).json({
            success: true,
            message: "Dispensa creata con successo.",
            id_prodotto: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getDispensa = async (req, res) => {
    try {
        const idUtente = req.userId;
        const idCasa = req.query.idCasa;

        if (!idUtente) {
            return res.status(400).json({ error: "Devi essere utente della casa per vederne i prodotti" });
        }
        const ruoloUtente = await checkHomeRole_model(idUtente, idCasa);

        if (!ruoloUtente) {
            return res.status(404).json({ error: "L'utente non appartiene a questa casa." });
        }

        if (!idCasa) {
            return res.status(400).json({ error: "È obbligatorio esplicitare l'id della casa attuale" });
        }

        const result = await getTipoDispensa_model(idCasa);

        res.status(201).json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const modDispensa = async (req, res) => {
    try {
        const idUtente = req.userId;
        const idDispensa = req.body.id_dispensa;
        const idCasa = req.body.id_casa;

        const datiDaModificare = req.body.dati_disp_tipo;
        const newNomeDispensa = req.body.nuovo_nome_dispensa;

        if (!idUtente) {
            return res.status(400).json({ error: "Devi essere utente della casa per vederne i prodotti" });
        }
        const ruoloUtente = await checkHomeRole_model(idUtente, idCasa);

        if (!ruoloUtente) {
            return res.status(404).json({ error: "L'utente non appartiene a questa casa." });
        }
        if (ruoloUtente !== 'owner' && ruoloUtente !== 'admin') {
            return res.status(403).json({ error: "L'utente non può modificare in questa casa." });
        }

        const { esito1, esito2 } = await modDispensa_model(idDispensa, datiDaModificare, newNomeDispensa);

        if (esito1.affectedRows === 0 || esito2.affectedRows === 0) {
            return res.status(400).json({ error: "Nessuna modifica apportata. Verifica i dati." });
        }

        res.status(200).json({ success: true, message: "Impostazioni della casa aggiornate correttamente." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const delDisp = async (req, res) => {
    try {
        const idUtente = req.userId;
        const idCasa = req.body.id_casa;
        const idDispensa = req.body.id_dispensa;

        const ruoloUtente = await checkHomeRole_model(idUtente, idCasa);

        if (!ruoloUtente) {
            return res.status(404).json({ error: "L'utente non appartiene a questa casa." });
        }

        if (ruoloUtente !== 'owner' && ruoloUtente !== 'admin') {
            return res.status(403).json({ error: "Azione negata. Solo owner e admin della casa possono eliminare una dispensa." });
        }

        const result = await delDisp_model(idDispensa);


        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "Nessuna dispensa eliminata. Verifica i dati." });
        }

        res.status(200).json({ success: true, message: "Dispensa eliminata" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};