import express from 'express';

import { addOggDisp } from '../controllers/dispOggettiController.js';
import { verifyToken } from '../config/auth.js';

const router = express.Router();

router.post('/', verifyToken, addOggDisp)

export default router;