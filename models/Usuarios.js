//VID 71
const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs'); //Importo la libreria para Hashear el PW en el HOOK.

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un Correo Valido'
            },
            notEmpty: {
                msg: 'el e-mail no puede estar vacio'
            },
        },
        unique: {
            args: true,
            msg: 'Usuario Ya Registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debe ingresar una contraseña'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaulValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//Metodos Personalizados
Usuarios.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);//Los usuarios pueden tener multiples proyectos.

module.exports = Usuarios;