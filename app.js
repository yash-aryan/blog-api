import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import debug from 'debug';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { connect } from 'mongoose';
import 'dotenv/config';
import apiRouter from './routes/routes.js';

const app = express();

// connect db
(async () => {
	try {
		debug('Connecting to database...');
		await connect(process.env.MONGODB_URI);
	} catch (err) {
		debug(err);
	}
})();

// set middlewares
app.use(
	cors({
		origin: '*',
		methods: ['GET', 'PUT', 'POST', 'DELETE'],
	})
);
app.use(
	rateLimit({
		limit: 20, // 20 requests per min
		message: 'Too many requests! Try again later',
	})
);
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '/public')));

// route api
app.use('/api/v1/', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404, 'Page not found!'));
});

// error handler
app.use((err, req, res, next) => {
	// sends json with error status and message
	res.status(err.status || 500).json({ success: false, message: err.message });
});

export default app;
