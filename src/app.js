import express from 'express';

import userRoutes from './routes/userRoutes.js'; 
import homeRoutes from './routes/homeRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import dispensaRoutes from './routes/dispensaRoutes.js';
import dispOggettiRoutes from './routes/dispOggettiRoutes.js'

import { contextMiddleware } from './config/requestContext.js';
import { httpLogger } from './config/httpLogger.js';

const app = express();
app.use(express.json());
app.use(contextMiddleware);
app.use(httpLogger);

app.use('/api/user', userRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/dispensa', dispensaRoutes);
app.use('/api/dispOggetti', dispOggettiRoutes);

export default app;