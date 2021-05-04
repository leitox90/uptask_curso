//Modelo de Tareas. VID 57
const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos'); // Importo la tabla Proyectos para crear una clave foranea.

const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});
Tareas.belongsTo(Proyectos); //Cada tarea pertenece a un proyecto.
//Proyectos.hasMany(Tareas); Un Proyecto tiene varias Tareas, esto deberia en en la tabla Proyectos.
module.exports = Tareas;

