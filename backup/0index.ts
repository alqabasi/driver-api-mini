import express from 'express';
import cors from 'cors';
// import helmet from 'helmet';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// Middleware
app.use(express.json());


app.use(cors());






// API Routes
const apiRouter = express.Router();
app.use('/api/v1', apiRouter);

// Mount routers
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/auth', authRoutes);

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`listening on port http://localhost://${port}`);
});
