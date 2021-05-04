//Controlador de Autenticacion. VID 81
const passport = require('passport'); //En este caso me traigo el passport instalado como dependencia. No todo los programado en config
//Importo passport para utilizar una funcion predefinida. En este caso una estrategia LOCAL.
const Usuarios = require('../models/Usuarios');//Importo el modelo de ususaruios VID 88
const Sequelize = require('sequelize');//VID 91
const Op = Sequelize.Op; //Operadores para comparar
const crypto = require('crypto'); // Utilidad para generar un TOKEN VID 89
const bcrypt = require('bcrypt-nodejs'); //Importo la libreria para Hashear VID 92
const enviarEmail = require('../handlers/email');//Para enviar la URL de restablecimiento de pw, VID 95


exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true, //Esto me permite pasar errores. 
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

//Funcion para revisar si el usuario esta logueado o no VID 82
exports.usuarioAutenticado = (req, res, next) => {
    //Si el usuario esta autenticado, adelante
    //Funcion de passport
    if(req.isAuthenticated()) {
        return next();
    }    
    //Sino, redirigir
    return res.redirect('/iniciar-sesion');//Sigo en el ROUTER
}

//Cerrar Sesion VID 83. Esto lo maneja el complemento session
exports.cerrarSesion = (req,res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

//Generar TOKEN para restablecer contraseña, si el usuario es valido VID 87 a 92.
exports.enviarToken = async (req,res) => {
    //Verificar que el usuario existe
    const {email} = req.body //Obtengo el email leyendo el body.
    const usuario = await Usuarios.findOne({where: { email }});    
    //Si no existe el usuario
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }else{
        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expiracion = Date.now() + 3600000;
        //Guardar Base de Datos
        await usuario.save();
        const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
        //Enviar correo con token de recuperacion de pw VID 95
        await enviarEmail.enviar({
            usuario: usuario,
            subject: 'Password Reset',
            resetUrl: resetUrl,
            archivo: 'reestablecer-password'
        });
        //Terminar la ejecucion.
        req.flash('correcto', 'Verifique su casilla de correo');
        res.redirect('/iniciar-sesion');
    }    
}

exports.validarToken = async (req,res) => {
    // res.json(req.params.token);    
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
    
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }
    //Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

//Cambiar el password
exports.actualizarPassword = async (req,res) => {
    console.log('Dentro de actualizarPassword');
    console.log(req.params.token); 
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    })
    //Verificamos si el usuario existe
    console.log('Verificacion de usuario');
    console.log(usuario);
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }else{
        //Hashear password
        usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        usuario.token = null;
        usuario.expiracion = null;
        //Guardar
        await usuario.save();
        req.flash('correcto', 'Su contraseña a sido modificada exitosamente');
        res.redirect('/iniciar-sesion');
    }
}
