'use strict;'

const app = require('./app');
const chalk = require('chalk');
require('dotenv').config()
const http = require('http');
const log = console.log;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const httpServer = http.createServer(app);

const uri = process.env.DB;
mongoose
    .connect(uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(x => {
        console.log(
            `Connected to Mongo! Database name: "${x.connections[0].name}"`
        );
    })
    .catch(err => {
        console.error("Error connecting to mongo", err);
    });

httpServer.listen(process.env.PORT || 3000, () => {
    log(`Server running ${chalk.greenBright(process.env.PORT)}`);
});