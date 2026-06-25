import { Marca, Oggetto_tipo, Dispensa_tipo, Prodotto } from '../entities/support.js';

import { getTipoDispensa_model, getTipoOggetti_model, getMarche_model, getProdotti_model, createCustom_model } from '../models/supportModel.js';
import { checkHomeRole_model } from '../models/homeModel.js';

export const getTipoDispensa = async (req, res) => {
    try {
        const result = await getTipoDispensa_model();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getTipoOggetti = async (req, res) => {
    try {
        const result = await getTipoOggetti_model();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMarche = async (req, res) => {
    try {
        const result = await getMarche_model();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProdotti = async (req, res) => {
    try {
        const idCasa = req.query.idCasa;
        const idUtente = req.userId;

        const termine = req.query.nomeProdotto || "";
        const nomeProdotto = `%${termine}%`;
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
        const result = await getProdotti_model(idCasa, nomeProdotto);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createCustom = async (req, res) => {
    try {
        const idUtente = req.userId;
        const idCasa = req.body.idCasa;
        const nomeProdotto = req.body.nomeProdotto;

        const idMarca = req.body.idMarca || null;
        const idTipo = req.body.idTipo || null;

        if (!idCasa || !nomeProdotto) {
            return res.status(400).json({ error: "Il nome del prodotto e l'ID della casa sono obbligatori." });
        }

        if (!idUtente) {
            return res.status(401).json({ error: "Utente non autenticato." });
        }

        const ruoloUtente = await checkHomeRole_model(idUtente, idCasa);

        if (!ruoloUtente) {
            return res.status(403).json({ error: "Azione negata. L'utente non appartiene a questa casa." });
        }

        const nuovoProdotto = new Prodotto({
            nome: nomeProdotto,
            fk_marca: idMarca,
            fk_ogg_tipo: idTipo,
            fk_casa: idCasa
        });

        const result = await createCustom_model(nuovoProdotto);

        res.status(201).json({
            success: true,
            message: "Prodotto personalizzato creato con successo.",
            id_prodotto: result.insertId
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};