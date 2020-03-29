'use strict'

// Este controlador se encarga de registrar un usuario en la base datos

const Boom = require('boom');
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

function logout (req, h) { // con.unstate quitamos la cookie al usuario y volvemos al home 
    return h.redirect('/login').unstate('user');  // al hacer logout
}

async function validateUser (req, h) {
    let result;
    try {
        result = await users.validateUser(req.payload); //esperamos la validación del modelo
        if(!result) {
            return h.response('Contraseña y/o email incorrectos').code(401);
        }
    } catch (error) {
        console.error(error)
        return h.response('Problemas validando el usuario').code(500)
    }
    return h.redirect('/').state('user', { //redireccionamos al home y al añadir el estado, añadimos la cookie
        name: result.name, // la cookie contendrá el nombre y email del usuario.
        email: result.email
    })
}

function failValidation (req, h, err) {
    //usamos Boom para indicar un error en caso de que la validación falle( como que el correo sea incorrecto)
    return Boom.badRequest('Fallo la validación', req.payload);
}

module.exports = {
    createUser: createUser,
    validateUser: validateUser,
    logout: logout,
    failValidation: failValidation,
}