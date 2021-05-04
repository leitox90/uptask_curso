const Sequelize = require('sequelize'); //Video 34
const db = require('../config/db')//Importo el archivo de configuracion y conexion de BD.
const slug = require('slug'); //VIDEO 39 y VIDEO 40.
const shortid = require('shortid'); //VIDEO 41. Libreria que se instala..

const Proyectos = db.define('proyectos', { //Defino le modelo. Nombre de la tabla 'proyectos'
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre : {
        type: Sequelize.STRING(100)
    },
    url : {
        type: Sequelize.STRING(100)
    }//otra forma de declarar es url : Sequelize.STRING sin corchetes.
}, {
    //VIDEO 40 HOOCKS.
    hooks: {
        beforeCreate(proyecto){ //proyecto es el objeto a insertar, en este caso contiene id,nombre,url.
            const url = slug(proyecto.nombre).toLowerCase(); //Creo la URL en base al nombre del proyecto.
            
            proyecto.url = `${url}-${shortid.generate()}`//VIDEO 41.
        }
    }
})
module.exports = Proyectos; //Lo exporto para poder utilizarlo en otras partes del programa.
