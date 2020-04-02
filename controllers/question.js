'use strict'

const { questions } = require('../models/index')

async function createQuestion (req, h) {
    let result
    try {
        result = await questions.create(req.payload, req.state.user)
        console.log(`Pregunta creada con el ID: ${result}`);
    } catch (error) {
        console.error(`Ha ocurrido un error, ${error}`)

        return h.view('ask', {
            title: 'Crear Pregunta',
            error: 'Problemas creando la pregunta'
        }).code(500).takeover()
    }
    return h.response(`Pregunta creada con el ID: ${result}`)
}

module.exports = {
    createQuestion: createQuestion,
}