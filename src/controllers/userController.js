import {getUsers} from '../models/userModel.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}