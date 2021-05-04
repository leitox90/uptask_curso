//VID 51 Configuracion de Babel Loader.
//La configuracion de esto sigue en el video 52, hay que crear un watch en el package.json
const path = require('path'); //Path nos permite acceder al file system.
const webpack = require('webpack'); // Importo el webpack

module.exports = {
    entry: './public/js/app.js', //EntryPoint, archivo de entrada. /public/js/app.js
    output: {
        filename: 'bundle.js', //Crea un bundle dentro de la carpeta que le paso en la linea de abajo. /public/dist/bundle.js
        path: path.join(__dirname, './public/dist') //Esta linea crea una nueva carpeta. El primer path es una palabra reservada de WEBPACK, el segundo es el path que importe.
    },
    module: {
        rules: [
            {
                test: /\.m?js$/, //Esto va a ir al EntryPoint y va a buscar todos los archivos .JS
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}