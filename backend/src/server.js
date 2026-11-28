import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';

import brandRoutes from './routes/brands.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`VelgGarage API running on port ${PORT}`));
}

export default app;
