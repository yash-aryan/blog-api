import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import debug from 'debug';
import { connect } from 'mongoose';
import 'dotenv/config';
import { fileURLToPath } from 'url';
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
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// sends json with error status and message
	res.status(err.status || 500).json({ success: false, message: err.message });
});

export default app;
