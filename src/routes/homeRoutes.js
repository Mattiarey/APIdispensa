import express from 'express'; 

import { getAllHomes } from '../controllers/homeController.js';

const router = express.Router();

// SOLO DEBUG, TOGLIERE SUBITO DOPO
router.get('/', getAllHomes);

export default router;