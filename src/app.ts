import express from 'express';
import path from "path";
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {sequelize} from "./Models";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

sequelize.sync().then(r => console.log("Models synchronized"));

import {router as indexRouter} from './routes/index';
import {router as usersRouter} from './routes/users';


app.use('/', indexRouter);
app.use('/api', usersRouter);

app.listen(port, () => {
    return console.log(`http://localhost:${port}`);
});
