// librerie 
import express from 'express'; 

// controller
import { getAllUsers } from '../controllers/userController.js';
import { createUser } from '../controllers/userController.js';


const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);

export default router;
