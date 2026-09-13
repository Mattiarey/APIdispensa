import express from 'express'; 

import { createDispensa, getDispensa, modDispensa } from '../controllers/dispensaController.js';
import { verifyToken } from '../config/auth.js';

const router = express.Router();

router.post('/', verifyToken, createDispensa);
router.get('/', verifyToken, getDispensa);
router.patch('/', verifyToken, modDispensa)

export default router;