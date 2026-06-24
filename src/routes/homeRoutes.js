import express from 'express'; 

import { getAllHomes, createHome, getHomeSlCd, modHome, delHome, kick, leave } from '../controllers/homeController.js';
import { verifyToken } from '../config/auth.js';

const router = express.Router();


router.get('/', getAllHomes); // SOLO DEBUG, TOGLIERE SUBITO DOPO
router.get('/id', getHomeSlCd) // SOLO DEBUG, TOGLIERE SUBITO DOPO

router.post('/', verifyToken, createHome);
router.patch('/', verifyToken, modHome);
router.delete('/', verifyToken, delHome);

router.patch('/caccia', verifyToken, kick);
router.patch('/esci', verifyToken, leave)
export default router;