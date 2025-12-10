import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import { OpenAPIV3 } from 'openapi-types';
import cors from 'cors'

import fs from 'fs';
import path from 'path';
import config from './config';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import driverRoutes from './routes/driverRoutes';
import transactionRoutes from './routes/transaction.routes';
import { rateLimiter } from './middleware/rate-limiter.middleware';

const app = express();

app.use(rateLimiter);

app.use(express.json());

// use this for dev only
app.use(cors())


// Load the OpenAPI specification
const openApiPath = path.resolve(process.cwd(), 'openapi.yaml');
const fileContents = fs.readFileSync(openApiPath, 'utf8');
const swaggerDocument = yaml.load(fileContents) as OpenAPIV3.Document;

// Serve Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/driver', driverRoutes);
app.use('/api/v1/transactions', transactionRoutes);

export default app;
