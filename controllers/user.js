'use strict'

// Este controlador se encarga de registrar un usuario en la base datos

const { users } = require('../models/index');

async function createUser (req, h) { 
    let result;
    try {
        result = await users.create(req.payload); //creamos el usuario con los datos del payload
    }
    catch(err) {
        console.error(err);
        return h.response('Problemas creando al usuario').code(500);
    }
    return h.response(`Usuario creado. ID: ${result}`)
}

module.exports = {
    createUser: createUser,
}