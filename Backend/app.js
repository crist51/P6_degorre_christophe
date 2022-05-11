const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors')
const path = require('path');

const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());

mongoose.connect('mongodb+srv://christophe:Black0451@cluster0.ufnf1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());//intercepte les requete json
app.use('/api/auth', userRoutes);


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes)



module.exports = app;