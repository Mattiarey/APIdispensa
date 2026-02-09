import express from 'express';
import userRoutes from './routes/userRoutes.js'; 
import { contextMiddleware } from './config/requestContext.js';

const app = express();
app.use(express.json());
app.use(contextMiddleware);

app.use('/api/user', userRoutes);

export default app;