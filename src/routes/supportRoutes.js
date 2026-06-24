import express from 'express'; 

import { getTipoDispensa, getTipoOggetti, getMarche } from '../controllers/supportController.js';
import { verifyToken } from '../config/auth.js';

const router = express.Router();

router.get('/getTipoDispensa', getTipoDispensa);
router.get('/getTipoOggetti', getTipoOggetti);
router.get('/getMarche', getMarche);

export default router;