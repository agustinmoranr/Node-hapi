'use strict'

const site = require('./controllers/site')
const user = require('./controllers/user')
module.exports = [
    { //definimos las características de la ruta y req
    method: 'GET',
    path: '/',
    handler: site.home
    },

    { 
        method: 'GET',
        path: '/register',
        handler: site.register
    },

    { 
        method: 'POST',
        path: '/create-user',
        handler: user.createUser
    },

    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.', // desde donde se serviran los archivos (osea el directorio actual que es public)
                index: ['index.html']  
            } 
        }
    }
]