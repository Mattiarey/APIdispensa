import jwt from 'jsonwebtoken';
const SECRET_KEY = "palle_pelose"; // da sostituire poi con process.env.JWT_SECRET

export const verifyToken = (req, res, next) => {
    // il client manda il token nell'header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({error: "Accesso negato, token mancante, scemo"});

    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.id;
        next();
    }catch (error) {
        res.status(403).json({error: "Token non valido o scaduto"});
    }
}