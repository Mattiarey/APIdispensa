import express from 'express'; 

import { createDispensa, getDispensa, modDispensa, delDisp } from '../controllers/dispensaController.js';
import { verifyToken } from '../config/auth.js';

const router = express.Router();

router.post('/', verifyToken, createDispensa);
router.get('/', verifyToken, getDispensa);
router.patch('/', verifyToken, modDispensa);
router.delete('/', verifyToken, delDisp);

export default router;