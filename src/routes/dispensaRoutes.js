import express from 'express'; 

import { createDispensa } from '../controllers/dispensaController.js';
import { verifyToken } from '../config/auth.js';

const router = express.Router();

router.post('/', verifyToken, createDispensa);


export default router;