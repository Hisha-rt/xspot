const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pedido = sequelize.define('Pedido', {
    folio: { type: DataTypes.STRING, allowNull: false, unique: true },
    usuario: { type: DataTypes.STRING, allowNull: false },
    categoria: { type: DataTypes.STRING },
    producto: { type: DataTypes.STRING },
    grupo_artista: { type: DataTypes.STRING },
    estatus_envio: { type: DataTypes.STRING, defaultValue: 'Comprado' },
    estatus_pago: { type: DataTypes.STRING, defaultValue: 'Pendiente' }
});

module.exports = Pedido;