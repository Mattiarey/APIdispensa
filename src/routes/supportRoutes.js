import express from 'express'; 

import { getTipoDispensa, getTipoOggetti, getMarche, getProdotti } from '../controllers/supportController.js';
import { verifyToken } from '../config/auth.js';

const router = express.Router();

router.get('/tipo-dispensa', getTipoDispensa);
router.get('/tipo-oggetti', getTipoOggetti);
router.get('/marche', getMarche);
router.get('/prodotti', verifyToken, getProdotti);

export default router;