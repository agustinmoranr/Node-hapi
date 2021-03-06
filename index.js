'use strict'

const Hapi = require('@hapi/hapi');
const handlebars = require('./lib/helpers');
const inert = require('@hapi/inert'); // plugin para servir archivos estáticos
const scooter = require('@hapi/scooter')
const blankie = require('blankie')
const hapiDevErrors = require('hapi-dev-errors');
const path = require('path'); // modulo nativo de node para gestionar rutas
const vision = require('@hapi/vision'); // plugin para hacer render de motores de plantillas 
const routes = require('./routes');
const site = require('./controllers/site');
const methods = require('./lib/methods')

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

        await server.register({
            plugin: require('@hapi/good'),
            options: {
                // ops: {
                //     interval: 2000
                // },
                reporters: {
                    myConsoleReporters: [
                        {
                            module: require('@hapi/good-console')
                        },
                        'stdout',
                    ]
                }
            }
        })

        await server.register({
            plugin: require('@hapi/crumb'),
            options: {
                cookieOptions: { // configuramos la cookie que utiliza crumb
                    isSecure: process.env.NODE_ENV === 'prod' // validamos si se encuentra en desarrollo o prod
                }
            }
        })

        await server.register([scooter, {
            plugin: blankie,
            options: {
              defaultSrc: `'self' 'unsafe-inline'`,
              styleSrc: `'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com`,
              fontSrc: `'self' 'unsafe-inline' data:`,
              scriptSrc: `'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com/ https://code.jquery.com/`,
              generateNonces: false
            }
          }])

          await server.register({
              plugin: hapiDevErrors,
              options: {
                  showErrors: process.env.NODE_ENV !== 'prod'
              }
          })

        await server.register({ // registramos el plugin de nuestra API
            plugin: require('./lib/api'),
            options: {
                prefix: 'api'
            }
        })

        server.method('setAnswerRight', methods.setAnswerRight)
        server.method('getLast', methods.getLast, {
            cache: {
                expiresIn: 1000 * 60, // tiempo de cache en el server
                generateTimeout: 2000 // si ocurre un error, se ejecuta después de 2 segundos
            }
        })

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

        // ext es un método servidor que nos permite escuchar un hook del life circle
        server.ext('onPreResponse', site.fileNotFound) // --> interceptamos el response
                    // si es un error de boom y es un error 404, se retorna la vista 404
        server.route(routes)

        await server.start();
    }
    catch(error) {
        console.error(error);
        process.exit(1);
    }
    server.log('info', `Servidor ejecutándose en el puerto: ${server.info.uri}`)
}

//unhandlerRejection y unhandlerException son errores de proceso generales, que todo proyecto 
// debería de controlar como mínimo
process.on('unhandledRejection', error => {
    server.log("UnhandlerRejection:", error)
});

process.on('unhandledException', error => {
    server.log("UnhandlerException:", error)
});
    
init();