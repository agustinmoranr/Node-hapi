'use strict'

const Hapi = require('@hapi/hapi');
const handlebars = require('handlebars');
const inert = require('@hapi/inert'); // plugin para servir archivos estáticos
const path = require('path'); // modulo nativo de node para gestionar rutas
const vision = require('@hapi/vision'); // plugin para hacer render de motores de plantillas 
const routes = require('./routes');

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {   //objeto de rutas
        files: { // propiedad files
            relativeTo: path.join(__dirname, 'public') 
        } // relativeTo define desde donde la ruta va a tomar los archivos (public)
    }
})
    
    async function init () {
        try{
            await server.register(inert) //server.register registra el plugin 
            await server.register(vision)

            server.state('user', {
                ttl: 1000 * 60 * 60 * 24 * 7, //timeToLive de la cookie
                isSecure: process.env.NODE_ENV === 'prod', //la cookie es segura en produccion
                encoding: 'base64json' //cookie hecha en base 64 y de tipo json
            })

            server.views ({ // método views para gestionar como utilizaremos nuestras vistas
                engines: { //hapi puede utilizar distintos motores de plantillas
                    hbs: handlebars // asociamos el plugin al tipo de archivos .hbs
                },
                relativeTo: __dirname, // para que las vistas las busque fuera de /public
                path: 'views', // directorio donde colocaremos las vistas 
                layout: true, // indicamos que utilizaremos layouts
                layoutPath: 'views' // ubicación de los layout  
            })

            server.route(routes)
            
            await server.start();
        }
        catch(error) {
            console.error(error);
            process.exit(1);
        }
        console.log(`Servidor ejecutándose en el puerto: ${server.info.uri}`)
    }

    //unhandlerRejection y unhandlerException son errores de proceso generales, que todo proyecto 
    // debería de controlar como mínimo
    process.on('unhandledRejection', error => {
        console.error("UnhandlerRejection:", error.message, error)
    });

    process.on('unhandledException', error => {
        console.error("UnhandlerException:", error.message, error)
    });
    
init();