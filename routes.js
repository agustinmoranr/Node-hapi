'use strict'

const site = require('./controllers/site')
const user = require('./controllers/user')
const Joi = require('@hapi/joi');
const question = require('./controllers/question');

module.exports = [
    { //definimos las características de la ruta y req
        method: 'GET',
        path: '/',
        options: {
            cache: { // cache en el lado del browser
                expiresIn: 1000 * 30, // almacenamos en cache por 30s
                privacy: 'private' // de manera privada
            }
        },
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
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().required().min(3),
                    email: Joi.string().email().required(),
                    password: Joi.string().required().min(6)
                }),
                failAction: user.failValidation // se ejecuta cuando halla un error durante la validación
            } 
        },
        handler: user.createUser
    },
    
    { 
        method: 'GET',
        path: '/login',
        handler: site.login
    },
    
    { 
        method: 'GET',
        path: '/question/{id}',
        handler: site.viewQuestion,
    },

    { 
        method: 'GET',
        path: '/logout',
        handler: user.logout
    },

    { 
        method: 'GET',
        path: '/ask',
        handler: site.ask
    },

    { 
        path: '/validate-user',
        method: 'POST',
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required().min(6)
                }),
                failAction: user.failValidation
            } 
        },
        handler: user.validateUser
    },

    {
        path: '/create-question',
        method: 'POST',
        options: {
          payload: {
            multipart: true,
          },
          validate: {
            payload: Joi.object({
              title: Joi.string().required(),
              description: Joi.string().required(),
              image: Joi.any().optional(),
            }),
            failAction: user.failValidation,
          },
        },
        handler: question.createQuestion,
      },

    {
        path: '/answer-question',
        method: 'POST',
        options: {
            validate: {
                payload: Joi.object({
                    answer: Joi.string().required(),
                    id: Joi.string().required()
                }), 
                failAction: user.failValidation 
            }
        },
        handler: question.answerQuestion
    },

    { 
        method: 'GET',
        path: '/answer/{questionId}/{answerId}',
        handler: question.setAnswerRight,
    },

    {
        method: 'GET',
        path: '/assets/{param*}',
        handler: {
            directory: {
                path: '.', // desde donde se serviran los archivos (osea el directorio actual que es public)
                index: ['index.html']  
            } 
        }
    },
    {
        method: ['GET', 'POST'], // decimos que estos dos métodos pueden caer en esta ruta
        path: '/{any*}', // si ninguna de las rutas esta definida o retorna algo, entonces caerá aquí
        handler: site.notFound
    }
]