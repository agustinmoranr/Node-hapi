'use strict'

const Hapi = require('@hapi/hapi');

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
})
    
    async function init () {
        server.route({ //definimos las características de la ruta y req
            method: 'GET',
            path: '/',
            handler: (req, h) => { //h es un objeto que nos ayuda a modificar la respuesta al cliente
               return h.response("Hola Mundo!").code(200);
            }
        })
        server.route({
            method: 'GET',
            path: '/redirect',
            handler: (req, h) => {
               return h.redirect("http://platzi.com");
            }
        })
        try{
            await server.start();
        }
        catch(error) {
            console.error(error);
            process.exit(1);
        }
        console.log(`Servidor ejecutandose en el puerto: ${server.info.uri}`)
    }
    
init();