// librerie 
import express from 'express'; 

// controller
import { getAllUsers } from '../controllers/userController.js';
import { createUser } from '../controllers/userController.js';
import { loginUser } from '../controllers/userController.js';
import { getUserById } from '../controllers/userController.js';
import { modUser } from '../controllers/userController.js';


const router = express.Router();

router.get('/', getAllUsers);
router.get('/id', getUserById);
router.get('/login', loginUser);

router.post('/', createUser);

router.patch('/', modUser);


export default router;
