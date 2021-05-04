//Importo Express. VID 16
const express = require('express');
const router = express.Router(); //Paso la funcion Router a la variable router.

//Importar EXPRESS VALIDATOR. VIDEO 38
// req.body usamos body porque el req esta en el body
// req.cookies
// req.headers
// req.params Ej: Actualizar o Eliminar registro.
// req.query
const { body } = require('express-validator/check');
//Check es una funcion que nos va a permitir validar.

//IMPORTO los controladores.. VIDEO 18. VID 58
const proyectosController = require ('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController'); //VID 69
const authController = require('../controllers/authController');//VID 81

//VID 16
module.exports = function(){
    //Rutas para Home
    router.get('/', 
        authController.usuarioAutenticado, //VID 82
        proyectosController.proyectosHome //Desde el HOME -> proyectosControllers y utilizo proyectosHome. VID 18
    );
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado, //VID 82
        proyectosController.formularioProyecto //VID 23, layout.pug main.contenedor Boton nuevo-proyecto.
    );
    //cuando clickeo en nuevo-proyecto llamo al formularioProyectos, de proyectosController de la carpeta Controllers, a su ves el formulario tira un response a nuevoProyecto.pug de VIEWS
    //VIDEO 25, esto tambien va al controlador.
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado, //VID 82
        //VIDEO 38
        body('nombre').not().isEmpty().trim().escape(), //Si no esta vacio, TRIM elimina espacios en blanco.ESCAPE para eliminar algunos caracteres como <>
        proyectosController.nuevoProyecto
    ); //Peudo definir vistas para POST/GET aunque sea la misa URL
    
    //Listar Proyecto
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado, //VID 82
        proyectosController.proyectoPorUrl
    );//Sigue en el controlador. :url es un comodin, puedo poner :hola u otra cosa.
    // Route.get() requires a callback function but got a [object Undefined]. Este error me salio porque puse mal el nombre de proyectoPorUrl.

    //Actualizar Proyecto VID 47/48/49
    router.get('/proyecto/editar/:ID', 
        authController.usuarioAutenticado, //VID 82
        proyectosController.formularioEditar
    ); //tareas.pug y proyectosController.
    //Vid 50
    router.post('/nuevo-proyecto/:ID',
        authController.usuarioAutenticado, //VID 82
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    //Eliminar Proyecto
    router.delete('/proyectos/:URL', 
        authController.usuarioAutenticado, //VID 82
        proyectosController.eliminarProyecto
    );// :URL es un comodin.

    //Rutas para las TAREAS.. VID 58.. Tambien hay que crear un controlador para las tareas.
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado, //VID 82
        tareasController.agregarTarea
    ); //Para cuando se agrega una nueva tarea

    //Actualizar Tarea. VID 63
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado, //VID 82
        tareasController.cambiarEstadoTarea
    );

    //Eliminar Tarea VID 65
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado, //VID 82
        tareasController.eliminarTarea
    );

    //Crear Nueva Cuenta VID 69
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta); //VID 72
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta); //VID 98

    //Iniciar Sesion. VID 78 - VID 81
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);    
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //Cerrar Sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //Reestablecer contraseña
    router.get('/reestablecer', usuariosController.formRestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);

    return router; //Retorno el router para poder usarlo en otras partes del proyecto.
}

