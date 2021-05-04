const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');//VID 97
//VID 69
exports.formCrearCuenta = (req, res) => {
    //Mando una vista
    res.render('crearCuenta', {
        nombrePagina : 'Crear Cuenta en UpTask'
    })
}

exports.formIniciarSesion = (req, res) => {
    //Alerta de ERRORES de Autenticacion VID 81
    const { error } = res.locals.mensajes; //Lo utilizo de esta forma porque ya lo tengo declarado en el index en app.use
    //Mando una vista
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en UpTask',
        error : error//Sigue en la vista iniciarSesion.pug VID 81.
    })
}
//VID 72
exports.crearCuenta = async (req,res) => {
    //Leer los datos. 
    const {email, password} = req.body; //Los datos los leemos del Body mediante BodyParser.  
    //VID 74 y 75
    try {
        //Crear el usuario
        await Usuarios.create({
            email,
            password
        });
        //VID 97
        //Crear URL de confirmacion
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        //Crear objeto de usuario
        const usuario = {
            email
        }
        //Enviar email
        await enviarEmail.enviar({
            usuario: usuario,
            subject: 'Confirme su e-mail en UpTask',
            confirmarUrl: confirmarUrl,
            archivo: 'confirmar-cuenta'
        });
        //Redirigir al usuario
        req.flash('correcto', 'Enviamos un correo de confirmación a su e-mail');
        res.redirect('/iniciar-sesion')
    } catch (error) {
        // console.log(error);
        //Paso un render a la vista, la vista de crearCuenta.pug. Ahi hago el menejo de los errores.
        req.flash('error', error.errors.map(error => error.message));//Crea diferentes elementos de errores, si hay 5 errores, todos van a estar agrupados en 'error'
        res.render('crearCuenta', {
            mensajes: req.flash(),//Paso los errores a la vista crearCuenta.pug
            nombrePagina: 'Crear Cuenta en UpTask',
            email: email,
            password: password //Mantener los datos que quiero ingresar en los campos, luego de un error, se agrega value= password en crearCuenta.pug, lo mismo con el email.
        })
    }
}

//VID 87. Vista reestablecer.pug
exports.formRestablecerPassword = (req,res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

//VID 98
//Cambia el estado de una cuenta Confirmado/No
exports.confirmarCuenta = async (req,res) => {
     //res.json(req.params.correo);//Lo uso para testear. correo es el comodin
     const usuario = await Usuarios.findOne({
         where: {
             email: req.params.correo
         }
     })
     //Si no existe el usuario
     if(!usuario) {
         req.flash('error', 'No Valido');
         res.redirect('/crear-cuenta');
     }else{
         usuario.activo = 1;
         await usuario.save();
         req.flash('correcto', 'Su cuenta ha sido activada satisfactoriamente');
         res.redirect('/iniciar-sesion');
     }

}