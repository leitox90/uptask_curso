//VID 93 Handler para enviar emails.
const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');//Permite agregar estilos lineales.
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    },
});

//Generar un HTML VID 94. MOdifique y le agregue archivo y opciones que por default va vacio para que no nos tire error si no se pasan opciones VID 95
const generarHtml = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones); //Usamos la funcion dirname para movernos entre las carpetas.
    return juice(html);
}

//VID 95
exports.enviar = async (opciones) =>{
    const html = generarHtml(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    //VID 93
    let  mailOptions = {
        from: '"UpTask" <no-reply@uptask.com>', 
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text: text,
        html: html
    };
    //Utilizo UTIL para que el transport soporte AWAIT.   Mediante UTIL, si algo no soporta async/await. Lo convierte.
    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, mailOptions);
    //transport.sendMail(mailOptions);
}



