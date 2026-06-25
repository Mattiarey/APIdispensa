import express from 'express';

import userRoutes from './routes/userRoutes.js'; 
import homeRoutes from './routes/homeRoutes.js';
import supportRoutes from './routes/supportRoutes.js';

import { contextMiddleware } from './config/requestContext.js';
import { httpLogger } from './config/httpLogger.js';

const app = express();
app.use(express.json());
app.use(contextMiddleware);
app.use(httpLogger);

app.use('/api/user', userRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/support', supportRoutes);

export default app;