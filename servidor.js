require('dotenv').config();
const rateLimit = require('express-rate-limit');
const express = require('express');
const aplicacion = express();
const db = require('./config/db'); 
const sequelize = require('./config/db');
const Producto = require('./models/Producto');
const Pedido = require('./models/Pedido'); // <-- ¡Agrega esta línea!
const cookieParser = require('cookie-parser');
    
// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middlewares
aplicacion.use(express.urlencoded({ extended: false }));
aplicacion.use(express.json());
aplicacion.use(express.static(__dirname + '/public'));
aplicacion.use(limiter);
aplicacion.use(cookieParser());

// Motor de plantillas
aplicacion.set('view engine', 'ejs');
aplicacion.set('views', __dirname + '/views');

const puerto = process.env.PORT || 3000;

db.authenticate()
    .then(() => {
        console.log('Conectado a MySQL exitosamente.');
        return db.sync({ alter: true }); // <--- CAMBIO AQUÍ
    })
    .then(() => {
        console.log('Tablas SQL sincronizadas.');
        aplicacion.listen(puerto, () => {
            console.log(`Servidor de XSPOT corriendo en el puerto ${puerto}`);
        });
    })
    .catch(error => console.log('Error conectando a la base de datos:', error));

aplicacion.use('/', require('./router/rutasWeb'));

aplicacion.use((req, resp, next) => {
    resp.status(404).render('404');
});