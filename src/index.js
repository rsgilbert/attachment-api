import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { body } from 'express-validator'
import { logErrorHandler, handleError } from './routes/router-utils.js'
import dbConfig from '../db.config.json.js'



const app = express();


app.use(morgan('tiny', { immediate: true })); // log the moment request hits the server
app.use(morgan('tiny'));
app.use(cors({
    credentials: true,
    origin: [/localhost/] // only localhost for now
}));
app.use(express.json());



app.get('/', (req, res) => res.send('Success, running'));

app.get('/test', (req, res) => {
    res.send("Test successful. App is running.")
});

// error handler middleware come last
app.use(logErrorHandler);
app.use(handleError);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('running on port', port));




