import express from 'express'; 

import { getAllHomes, createHome, getHomeSlCd, modHome } from '../controllers/homeController.js';

const router = express.Router();


router.get('/', getAllHomes); // SOLO DEBUG, TOGLIERE SUBITO DOPO
router.get('/id', getHomeSlCd)

router.post('/', createHome);
router.patch('/', modHome);

export default router;