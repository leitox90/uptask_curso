const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req,res, next) => {
    //Obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne ({where: { url: req.params.url }})
    console.log(proyecto);
    console.log(req.body)

    //Leer el valor del input
    const {tarea} = req.body;
    
    //Estado 0 incompleto, ID proyecto
    const estado = 0;
    const proyectoId = proyecto.id

    //Insertar Base de Datos
    const resultado = await Tareas.create({tarea, estado, proyectoId});

    if(!resultado){
        return next();
    }

    //Redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req, res) =>{
    //console.log(req.params);//Cuando mandas un patch se accede a los datos con params.
    const {id} = req.params
    const tarea = await Tareas.findOne({where: {id: id}});
    //console.log(tarea);
    let estado = 0
    if(tarea.estado === estado){
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();
    if(!resultado) return next();
    res.status(200).send('Actualizado');
}
//VID 65, 66
exports.eliminarTarea = async (req,res) =>{
    //console.log('Controlador Tareas: ',req.params);
    const { id } = req.params;
    //Eliminar la TAREA
    const resultado = await Tareas.destroy({where : { id : id }});
    
    if(!resultado) return next();

    res.status(200).send('Tarea Eliminada Correctamente');
    //Back End
}