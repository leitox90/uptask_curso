//Modificacion en video 36
//Importo el modelo, porque todas las interacciones con la base de datos son por medio del modelo. 
//El controlador es el que se encarga de comunicarse con el modelo, por eso lo importo aca.
const Proyectos = require('../models/Proyectos'); //Importo proyectos que viene del modelo. Esto tiene toda la conexion a la base de datos. VID 36
const Tareas = require('../models/Tareas');

//Exporto proyectosHome, para utilizarlo en routes/index.js VIDEO 18
exports.proyectosHome = async (req,res)=> {
    // console.log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id;//VID 86
    const proyectos = await Proyectos.findAll({where: { usuarioId : usuarioId }}); //ES importante que esta linea de codigo junto con el pasaje de proyectos se repita en todos los lugares que muestren los proyectos.
    //findAll es un SELECT * FROM. USO ASYNC Y AWAIT para mejorar el rendimiento de la base de datos.
    //El controlador interactua con el modelo, le pide los resultados (= await Proyectos.findAll) y los asigna en preyectos. VIDEO 42.

    res.render('index', {
        // .render imprime HTML, toma como parametro el nombre de la vista, en este caso index.
        nombrePagina : 'Proyectos', //Render toma dos parametros, uno es la vista y el otro las opciones. VIDEO 22
        proyectos //Paso lo que traje del MODELO a la VISTA. VIDEO 42. views/layout.pug, routes/index.js y controller/proyec....
    }); //Render imprime html, send no.
}
//Este es el formulario del boton nuevo proyecto en layout.pug VID 23
exports.formularioProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;//VID 86
    const proyectos = await Proyectos.findAll({where: { usuarioId : usuarioId }});//VID 86
    res.render('nuevoProyecto', { //Tengo que crear la vista nuevoProyecto en VIEWS.
        nombrePagina : 'Nuevo Proyecto',
        proyectos
    });
}
//VIDEO 25..Modificacion VIDEO 37. Async/Await. Await lo uso en la insercion en la parte del Sequelize
exports.nuevoProyecto = async(req,res) => {
    const usuarioId = res.locals.usuario.id;//VID 86
    const proyectos = await Proyectos.findAll({where: { usuarioId : usuarioId }});//VID 86
    //Enviar a la consola lo que el usuario escriba
    // console.log(req.body); //.body es la forma de acceder a lo que el usuario escribe. Esto lo voy a ver en powershell. Habilitar libreria bodyParser.

    //validar que tengamos algo en el imput VID 27.
    const { nombre } = req.body; //En la variable nombre guardo lo que se mando en la caja de texto
    let errores = []; // let errores igual a un arreglo de errores.
    if (!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'}) 
    }
    //si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', { //Mando un render a la VISTA nuevoProyecto. Al nivel del H1 en la vista nuevoProyecto le paso la variable errores.
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos //VIDEO 46, para vitar errores.
        })
    } else{ 
        //No hay errores
        //Insertar en la BD.
        //Video 37 ASYNC AWAIT.. En el video 36 hay otra forma de insertar pero no la utilizamos.
        const usuarioId = res.locals.usuario.id;//VID 85  
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
        //La variable nombre la obtengo del formulario nuevo proyecto por medio del body.Linea 34 const { nombre } = req.body;
    }    
}

//VIDEO 46
exports.proyectoPorUrl = async (req,res,next) => {
    //Mejora Consulta BASE DE DATOS VID 48 //MOD VID 86
    const usuarioId = res.locals.usuario.id;//VID 86
    const proyectosPromise = Proyectos.findAll({where: { usuarioId : usuarioId }});//VID 86

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url, //Utilizo .url porque es el comodin que utilize en el index del router.
            usuarioId: usuarioId
        }
    })
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar Tareas del proyecto actual. VID 60.
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }//,
        // include: [
        //     { model: Proyectos}
        // ]
    });

    if(!proyecto) return next();//Si no hay proyectos va a saltar al siguiente middleware, lo de abajo de esto no se va a ejecutar.
    // console.log(proyecto);
    // res.send('OK'); esto es para testear si funciona
    //Creamos un RENDER VID 46
    res.render('tareas', { //tareas es el nombre de la VISTA.
        nombrePagina : 'Tareas del Proyecto',
        proyecto,
        proyectos, //Paso los proyectos para que no me salte un error. VIDEO 46.
        tareas
    })
}

//VID 47
exports.formularioEditar = async (req, res) =>{
    //MOD VID 86
    const usuarioId = res.locals.usuario.id;//VID 86
    const proyectosPromise = Proyectos.findAll({where: { usuarioId : usuarioId }});//VID 86

    const proyectoPromise = Proyectos.findOne({
        where:{
            id: req.params.ID,
            usuarioId: usuarioId
        }
    });

    //Array Distructuring
    const [proyectos, proyecto] = await  Promise.all([proyectosPromise, proyectoPromise]);

    //Render a la VISTA
    res.render('nuevoProyecto', { //Re-utilizo la vista nuevoProyecto.pug
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

//VID 50
exports.actualizarProyecto = async(req, res) =>{
    const usuarioId = res.locals.usuario.id;//VID 86
    const proyectos = await Proyectos.findAll({where: { usuarioId : usuarioId }});//VID 86

    //Validar que tenga algo el input
    const nombre = req.body.nombre;     
    let errores = [];
    if(!nombre){
        errores.push({'texto': 'Agrega un nombre al Proyecto'})
    }
    //Si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else {
        //No hay errores
        //Insertamos
        await Proyectos.update(
            { nombre: nombre },
            {where: { id: req.params.ID }}
            );
        res.redirect('/');
    }
}

//VID 55. Lado servidor.
exports.eliminarProyecto = async(req, res,next) =>{
    //req contiene la informacion, puedo usar query o params para leer los datos.
    // console.log(req);
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({where: {url : urlProyecto}});
    //Manejo de errores, perdia de comunicacion, si no hay resultado, salta al siguiente middle
    if(!resultado){
        return next();
    }
    res.status(200).send('Proyecto Eliminado Correctamente'); //Status 200 quiere decir que el request es correcto.
}


