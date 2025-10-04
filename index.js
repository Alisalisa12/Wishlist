import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
mongoose.connect('mongodb+srv://admin:Z0rla03kFeEeVRtR@cluster0.fqgrana.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then (() => console.log('DB ok'))
.catch(() => console.log('DB error', err));


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.post('/login', (req, res) => {
    console.log(req.body);
    const token = jwt.sign(
        {
            email: req.body.email,
            fullName: 'Иван Иванов'
        },
        'key123',
    );

    res.json({
        success: true,

    });
});

app.listen(7777, (err) => {
    if (err) {
        return console.log('err');
    }

    console.log('Server OK')
});