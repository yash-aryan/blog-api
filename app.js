import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import debug from 'debug';
import { connect } from 'mongoose';
import 'dotenv/config';
import { fileURLToPath } from 'url';

// import routes
import indexRouter from './routes/index.js';

const app = express();

// connect db
(async () => {
	try {
		await connect(process.env.MONGODB_URI);
	} catch (err) {
		debug(err);
	}
})();

// set middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '/public')));

// set routes
const prefixPath = '/api/v1/';
app.use(prefixPath, indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// sends json with error status and message
	res.status(err.status || 500).json({ status: err.status, message: err.message });
});

export default app;
