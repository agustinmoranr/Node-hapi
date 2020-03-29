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

async function validateUser (req, h) {
    let result;
    try {
        result = await users.validateUser(req.payload); //esperamos la validación del modelo
    } catch (error) {
        console.error(error)
        return h.response('Problemas validando el usuario').code(500)
    }
    return result;
}

module.exports = {
    createUser: createUser,
    validateUser: validateUser,
}