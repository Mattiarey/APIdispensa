// librerie 
import express from 'express'; 

// controller
import { getAllUsers, createUser, loginUser, getUserById, modUser, delUser, joinHome } from '../controllers/userController.js';

import { verifyToken } from '../config/auth.js';

const router = express.Router();


router.get('/', getAllUsers); // SOLO DEBUG, TOGLIERE SUBITO DOPO
router.get('/me', verifyToken, getUserById); // SOLO DEBUG, TOGLIERE SUBITO DOPO

router.post('/login', loginUser);

router.post('/', createUser);

router.patch('/', verifyToken, modUser);

router.delete('/', verifyToken, delUser);




router.post('/join', verifyToken, joinHome);
export default router;
