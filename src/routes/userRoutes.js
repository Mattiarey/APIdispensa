// librerie 
import express from 'express'; 

// controller
import { getAllUsers } from '../controllers/userController.js';
import { createUser } from '../controllers/userController.js';
import { loginUser } from '../controllers/userController.js';
import { getUserById } from '../controllers/userController.js';
import { modUser } from '../controllers/userController.js';
import { delUser } from '../controllers/userController.js';

import { verifyToken } from '../config/auth.js';

const router = express.Router();

// SOLO DEBUG, TOGLIERE SUBITO DOPO
router.get('/', getAllUsers);
router.get('/me', verifyToken, getUserById);

router.post('/login', loginUser);

router.post('/', createUser);

router.patch('/', verifyToken, modUser);

router.delete('/', verifyToken, delUser);

export default router;
