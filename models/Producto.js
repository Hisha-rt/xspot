const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Producto = db.define('Producto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artista: { 
        type: DataTypes.STRING 
    },
    grupo: { 
        type: DataTypes.STRING 
    },
    tipo: {
        type: DataTypes.ENUM('Álbum', 'Photocard', 'Merch Oficial', 'Otro'),
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    estado_go: {
        type: DataTypes.ENUM('Pre-venta', 'Comprado', 'Agotado', 'En aduana', 'Envíos nacionales', 'Stock'),
        defaultValue: 'Stock'
    },
    imagen_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    versiones: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'productos',
    timestamps: true
});

module.exports = Producto;