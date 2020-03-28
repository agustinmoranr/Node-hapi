'use strict'

const Hapi = require('@hapi/hapi');
const inert = require('@hapi/inert'); // plugin para servir archivos estáticos
const path = require('path'); // modulo nativo de node para gestionar rutas

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

            server.route({ //definimos las características de la ruta y req
                method: 'GET',
                path: '/home',
                handler: (req, h) => { //h es un objeto que nos ayuda a modificar la respuesta al cliente
                   return h.file('index.html').code(200) //h.file sirve un archivo 
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