const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'event_db',
    useNewUrlParser: true,
    useUnifiedTopology: true 
}, err => err ? console.log(err) : console.log('Connected to database'));

const managersRouter = require('./routes/managers');
const customersRouter = require('./routes/customers');



app.use('/managers', managersRouter);
app.use('/customers', customersRouter);


app.listen(port, () => {
    console.log(`server is running on port:${port}`);
});