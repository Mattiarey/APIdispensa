import express from 'express'; 

import { getAllHomes, createHome, getHomeSlCd, modHome, delHome } from '../controllers/homeController.js';
import { verifyToken } from '../config/auth.js';

const router = express.Router();


router.get('/', getAllHomes); // SOLO DEBUG, TOGLIERE SUBITO DOPO
router.get('/id', getHomeSlCd)

router.post('/', verifyToken, createHome);
router.patch('/', verifyToken, modHome);
router.delete('/', verifyToken, delHome);

export default router;