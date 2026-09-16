const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Producto = require('../models/Producto');
const Pedido = require('../models/Pedido');
const upload = require('../config/cloudinary');

// ==========================================
// --- 1. RUTAS PUBLICAS (PARA COMPRADORES) ---
// ==========================================

router.get('/', (req, res) => {
    res.render('index'); 
});

router.get('/terminos', (req, res) => { 
    res.render('terminos'); 
});

router.get('/mi-carrito', (req, res) => { 
    res.render('mi-carrito'); 
});

// Catalogo con todos los filtros incluidos
router.get('/catalogo', async (req, res) => {
    try {
        const { tipo, grupo, estado_go } = req.query;
        let condiciones = {}; 

        if (tipo && tipo !== 'Todos') {
            condiciones.tipo = tipo;
        }
        
        // Busqueda dual por artista o grupo
        if (grupo) {
            condiciones[Op.or] = [
                { artista: { [Op.like]: `%${grupo}%` } },
                { grupo: { [Op.like]: `%${grupo}%` } }
            ];
        }
        
        if (estado_go) {
            condiciones.estado_go = estado_go;
        }

        const productos = await Producto.findAll({ where: condiciones });
        res.render('catalogo', { productos, filtrosActuales: { tipo, grupo, estado_go } });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error cargando el catalogo');
    }
});

router.get('/producto/:id', async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).render('404');
        }
        res.render('detalle', { producto });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error cargando el producto');
    }
});

router.get('/masterlist', async (req, res) => {
    try {
        const { folio } = req.query;
        let busqueda = {};

        if (folio) {
            busqueda.folio = { [Op.like]: `%${folio}%` };
        }

        const pedidos = await Pedido.findAll({ 
            where: busqueda,
            order: [['createdAt', 'DESC']]
        });
        
        res.render('masterlist', { pedidos, folioBuscado: folio });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error cargando la Masterlist');
    }
});


// ==========================================
// --- 2. RUTAS DE ADMINISTRACION (INVENTARIO) ---
// ==========================================

const verificarAdmin = (req, res, next) => {
    if (req.cookies.adminAuth === process.env.ADMIN_PASS) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/infoProductos', verificarAdmin, async (req, res) => {
    try {
        const { busqueda } = req.query;
        let condiciones = {};

        if (busqueda) {
            condiciones = {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${busqueda}%` } },
                    { artista: { [Op.like]: `%${busqueda}%` } },
                    { grupo: { [Op.like]: `%${busqueda}%` } }
                ]
            };
        }

        const productos = await Producto.findAll({ 
            where: condiciones,
            order: [['createdAt', 'DESC']] 
        });
        
        res.render('CRUD/infoProductos', { productos, busqueda });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error cargando el inventario');
    }
});

router.get('/crear', verificarAdmin, (req, res) => {
    res.render('CRUD/crear'); 
});

// Ruta modificada para subir la imagen a Cloudinary al crear
router.post('/crear', verificarAdmin, upload.single('imagen_url'), async (req, res) => {
    try {
        const datosProducto = req.body;
        
        if (req.file) {
            datosProducto.imagen_url = req.file.path;
        }

        await Producto.create(datosProducto);
        res.redirect('/infoProductos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar el producto');
    }
});

router.get('/editar/:id', verificarAdmin, async (req, res) => {
    const producto = await Producto.findByPk(req.params.id);
    res.render('CRUD/editar', { producto });
});

// Ruta modificada para subir una imagen nueva al editar
router.post('/editar/:id', verificarAdmin, upload.single('imagen_url'), async (req, res) => {
    try {
        const datosActualizados = req.body;
        
        if (req.file) {
            datosActualizados.imagen_url = req.file.path;
        }

        await Producto.update(datosActualizados, { where: { id: req.params.id } });
        res.redirect('/infoProductos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el producto');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const contrasenaIngresada = req.body.password;
    if (contrasenaIngresada === process.env.ADMIN_PASS) {
        res.cookie('adminAuth', process.env.ADMIN_PASS, { httpOnly: true });
        res.redirect('/adminMasterlist');
    } else {
        res.redirect('/login');
    }
});

router.post('/eliminar/:id', verificarAdmin, async (req, res) => {
    await Producto.destroy({ where: { id: req.params.id } });
    res.redirect('/infoProductos');
});

router.post('/estado/:id', verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_go } = req.body;

        await Producto.update(
            { estado_go },
            { where: { id } }
        );

        res.redirect('/infoProductos');
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).send('Error actualizando el estado del producto');
    }
});


// ==========================================
// --- 3. PANEL ADMIN: MASTERLIST DE PEDIDOS ---
// ==========================================

router.get('/adminMasterlist', verificarAdmin, async (req, res) => {
    const pedidos = await Pedido.findAll({ order: [['createdAt', 'DESC']] });
    res.render('CRUD/adminMasterlist', { pedidos });
});

router.post('/adminMasterlist/crear', verificarAdmin, async (req, res) => {
    try {
        await Pedido.create(req.body);
        res.redirect('/adminMasterlist');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error guardando el pedido (Revisa que el folio no este repetido)');
    }
});

router.post('/adminMasterlist/actualizar/:id', verificarAdmin, async (req, res) => {
    await Pedido.update(req.body, { where: { id: req.params.id } });
    res.redirect('/adminMasterlist');
});

router.post('/adminMasterlist/eliminar/:id', verificarAdmin, async (req, res) => {
    await Pedido.destroy({ where: { id: req.params.id } });
    res.redirect('/adminMasterlist');
});

module.exports = router;