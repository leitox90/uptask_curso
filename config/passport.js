//VID 79
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al Modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

//Local Strategy - Login con credenciales propias (Usuario y Contraseña)
passport.use(
    new LocalStrategy(
        //Nueva Instancia de LocalStrategy
        //Por default  passport espera un usuario y password
        //Los campos a autenticar los declaro como los tengo declarados en el Modelo de la Base de Datos.
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email:email,
                        activo: 1 //Video 98, verifico si el usuario activo su cuenta confirmando el email
                    }
                })
                //El usuario existe pero la password es incorrecta.. VID 79/80.
                if(!usuario.verificarPassword(password)){
                    //En caso de que la contraseña sea incorrecta
                    return done(null, false, {//DONE toma tres parametros: error, usuario, y en este caso un mensaje
                        message: 'Contraseña Incorrecta'
                    })
                }
                //Email y password CORRECTOS
                return done(null, usuario);//Este usuario es un objeto, va a tener ID, email, pwd    
            } catch (error) {
                //Si el usuario no existe
                return done(null, false,{
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

//Serealizar el Usuario
passport.serializeUser( (usuario, callback) =>{
    callback(null, usuario); // Toma dos parametros, error y ID
});
//De-serealizar el Usuario
passport.deserializeUser((usuario, callback) =>{
    callback(null, usuario);
});
//Exportar
module.exports = passport;