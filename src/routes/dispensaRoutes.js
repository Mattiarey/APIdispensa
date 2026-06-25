import express from 'express'; 

import { createDispensa, getDispensa } from '../controllers/dispensaController.js';
import { verifyToken } from '../config/auth.js';

const router = express.Router();

router.post('/', verifyToken, createDispensa);
router.get('/', verifyToken, getDispensa);

export default router;