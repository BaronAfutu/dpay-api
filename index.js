const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const helmet = require("helmet");
const transactionRouter = require('./routes/transaction');
require('dotenv').config({ path: './.env' });

const PORT = process.env.PORT || 3000;

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

// app.db = db

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use('/api/',transactionRouter);

app.listen(PORT,()=>console.log(`This server us running on port ${PORT}!!`));