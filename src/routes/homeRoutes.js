import express from 'express'; 

import { getAllHomes, createHome, getHomeSlCd } from '../controllers/homeController.js';

const router = express.Router();

// SOLO DEBUG, TOGLIERE SUBITO DOPO
router.get('/', getAllHomes);
router.get('/id', getHomeSlCd)

router.post('/', createHome);

export default router;