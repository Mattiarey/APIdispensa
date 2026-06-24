import express from 'express'; 

import { getTipoDispensa, getTipoOggetti, getMarche, getProdotti } from '../controllers/supportController.js';
import { verifyToken } from '../config/auth.js';

const router = express.Router();

router.get('/getTipoDispensa', getTipoDispensa);
router.get('/getTipoOggetti', getTipoOggetti);
router.get('/getMarche', getMarche);
router.get('/getProdotti', getProdotti);

export default router;