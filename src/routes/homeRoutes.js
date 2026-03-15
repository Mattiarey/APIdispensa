import express from 'express'; 

import { getAllHomes, createHome } from '../controllers/homeController.js';

const router = express.Router();

// SOLO DEBUG, TOGLIERE SUBITO DOPO
router.get('/', getAllHomes);

router.post('/', createHome);

export default router;