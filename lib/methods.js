'use strict'

/* Los métodos de servidor son funciones que podremos utilizar a través del objeto
request en nuestras rutas de toda la aplicación. Esto nos ayuda a evitar tener que importar
demasiados módulos de otros archivos. Teniendo así, una mejor arquitectura*/

const { questions } = require('../models/index')

async function setAnswerRight (questionId, answerId, user) {
    let result 
    try {
        result = await questions.setAnswerRight(questionId, answerId, user)
    } catch (error) {
        console.error(error)
        return false
    }
    return result;
}

async function getLast (amount) {
    let data;
    try {
        data = await questions.getLast(10);
    } catch (error) {
        console.error(error)
    }
    console.log('Se ejecuto el método')
    return data;
}

module.exports = {
    getLast: getLast,
    setAnswerRight: setAnswerRight
}