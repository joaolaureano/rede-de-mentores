import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { query } from './configs/database/connection';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'assets', 'userImages'))
    );
  }

  routes() {
    // atras do CloudFront vira /api/health: prova Lambda -> Neon de ponta a ponta
    this.server.get('/health', async (req, res) => {
      try {
        await query('SELECT 1');
        return res.json({ status: 'ok' });
      } catch (err) {
        return res.status(503).json({ status: 'db-unavailable' });
      }
    });
    this.server.use(routes);
  }
}
export default new App().server;
