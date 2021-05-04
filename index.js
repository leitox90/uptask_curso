const express = require('express'); //importa express dentro de la variable express VID 14.
const routes = require('./routes');//Importo el index de la carpeta routes. Importo las rutas. VIDEO 16.
const path = require('path');//Importo el path. Path lee los archivos que existen en las carpetas. VID 20
const bodyParser = require('body-parser'); //Importo libreria bodyparser. Puede que requiera instalacion, normalmente no. VIDEO 26
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');//VID 76
const cookieParser = require('cookie-parser');//VID 76
const passport = require('./config/passport');//VID 80
//Leer valores de variables.env vid 101
require('dotenv').config({path: 'variables.env'})


//En el video 44 hay una parte donde usa año. Por si la llego a necesitar.

//IMPORTO el Helpers y sus funciones. VIDEO 43
const helpers = require('./helpers'); // con './' indico que son archivos internos. Si pongo el nombre sin ./ va a tomar como si fuera un archivo de express

//CREAR LA CONEXION A LA BD VIDEO 35
const db = require('./config/db');

//Importo el modelo VIDEO 35, 57 importo Tareas, Importo Usuarios VID 71
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

//db.authenticate()//Retorna un valor (promise) Primer alternativa. VID 35
//Otra alternativa Importando el modelo. Esto crea la tabla si no esta creada.
db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch((error) => console.log(error));

//creo una app de express. VID 14
const app = express(); //Paso la variable express como funcion. app contiene todo los necesario de express.

//Donde cargar los archivos estaticos VIDEO 21 y 22
app.use(express.static('public')); //nombre de la carpeta public.

//Habilitar PUG. VID 20. View Engine
app.set('view engine','pug') //"view engine" palabra reservada de express

//Habilitar bodyParser para leer datos del formulario VIDEO 26. IMPORTANTE
app.use(bodyParser.urlencoded({extended: true}));

//Añadir carpeta de las vistas. VIDEO 20
app.set('views', path.join(__dirname, './views')); //Agrego el path a las vistas y le digo en que carpeta se va a encontrar.

//Agregar Flash Messages VID 74
app.use(flash());

//Cookie Parser VID 76
app.use(cookieParser());

//Sesiones, nos permite navegar en distintas paginas sin volvernos a autenticar VID 76
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

//Inicio el Passport VID 80
app.use(passport.initialize());//Inica una instancia de passport
app.use(passport.session());

//Pasar var dump a la aplicacion. VIDEO 43. VID 76
//Variable Globales
app.use((req,res, next) =>{
    res.locals.vardump = helpers.vardump;//res.locals me permite crear variables globales. Va a ser llamada en (VIEWS/layout.pug). .vardump es el nombre de la variable
    res.locals.mensajes = req.flash();//VID 76. Connect Flash, manejo de alertas.
    res.locals.usuario = {...req.user} || null; //VID 84. Guardar el Usuario Logueado    
    next();//Despues de completar la accion anterior, con next paso a la siguiente accion del middle.
});

app.use('/', routes());//VIDEO 16. Como en el routes exporte una funcion, aca tambien lo uso como funcion().
//Cuando llega al home: '/', lee las rutas que se pasaron en routes().

//app.listen(3000); //le indico el puerto que quiero utilizar. Usar un puerto no usado (3000,7000,9000) VID 14. NO LO USO MAS VID 101
//ahora modifico el script en el package.json

//require('./handlers/email'); //VID 93 Lo utilize para comprobar si los emails de password se enviavan.

//VID 101. Servidor y Puerto. REVER VIDEO
const host = process.env.HOST || '0.0.0.0'; //Herocu se va a encargar de asignar una url de servidor validad para 0.0.0.0
const port = process.env.PORT || 3000; // Si existe se asigna de las variables, sino le asignamos 3000. Lo maneja Herocu
app.listen(port, host, ()=> {
    console.log('El servidor esta funcionando');
});




