'use strict'

const Hapi = require('@hapi/hapi');
const handlebars = require('handlebars');
const inert = require('@hapi/inert'); // plugin para servir archivos estáticos
const path = require('path'); // modulo nativo de node para gestionar rutas
const vision = require('@hapi/vision'); // plugin para hacer render de motores de plantillas 

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

            server.views ({ // método views para gestionar como utilizaremos nuestras vistas
                engines: { //hapi puede utilizar distintos motores de plantillas
                    hbs: handlebars // asociamos el plugin al tipo de archivos .hbs
                },
                relativeTo: __dirname, // para que las vistas las busque fuera de /public
                path: 'views', // directorio donde colocaremos las vistas 
                layout: true, // indicamos que utilizaremos layouts
                layoutPath: 'views' // ubicación de los layout  
            })

            server.route({ //definimos las características de la ruta y req
                method: 'GET',
                path: '/',
                handler: (req, h) => { //h es un objeto que nos ayuda a modificar la respuesta al cliente
                   return h.view('index', { // h.view sirve una vista 
                       title: "Home", // valor de nuestra variable de handlebars
                   }) 

                }
            })
            server.route({
                method: 'GET',
                path: '/{param*}',
                handler: {
                    directory: {
                        path: '.', // desde donde se serviran los archivos (osea el directorio actual que es public)
                        index: ['index.html']  
                    } 
                }
            })

            await server.start();
        }
        catch(error) {
            console.error(error);
            process.exit(1);
        }
        console.log(`Servidor ejecutándose en el puerto: ${server.info.uri}`)
    }
    
init();