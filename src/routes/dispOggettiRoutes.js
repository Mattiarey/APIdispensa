import express from 'express';

import { addOggDisp, getOgggettiDispensa } from '../controllers/dispOggettiController.js';
import { verifyToken } from '../config/auth.js';

const router = express.Router();

router.post('/', verifyToken, addOggDisp)

// i parametri vanno messi con il ? nell'url
router.get('/:idCasa/oggetti', verifyToken, getOgggettiDispensa)

export default router;