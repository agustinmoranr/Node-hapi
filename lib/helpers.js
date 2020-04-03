'use strict'

const handlebars = require('handlebars')

function registerHerlper ()  {
    handlebars.registerHelper('answerNumber', (answers) => {
        const keys = Object.keys(answers) // creamos un arreglo de llaves a partir de la collecion
        return keys.length // para poder usar .length y mostrar la cantidad de respuestás que hay
    })

// Definición clásica de un método de bloque (mírese la documentación de handlebars)
    handlebars.registerHelper('ifEquals', (dueño, actualUser, options) => {
        if (dueño === actualUser) {
            console.log(this)
            return options.fn(this) // si la condición se cumple, se ejecuta lo que esta dentro del bloque
        }
        console.log(this)
        return options.inverse(this) // sino, la condición se va a invertir
    }) 
    return handlebars
}

module.exports = registerHerlper()