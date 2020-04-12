'use strict'

const fs = require('fs')
const { promisify } = require('util')
const { join } = require('path')
const { questions } = require('../models/index');
const uuid = require('uuid/v1');

const write = promisify(fs.writeFile)

async function createQuestion (req, h) {
    if(!req.state.user) {
      return h.redirect("/login")
    }

    let result
    let filename
    try {
      if(Buffer.isBuffer(req.payload.image)) { //validamos si llego un buffer para ser almacenado
        filename = `${uuid()}.png`;
        await write(join(__dirname, '..', 'public', 'uploads', filename), req.payload.image)
      }
      result = await questions.create(req.payload, req.state.user, filename)
      req.log('info', `Pregunta creada con el ID ${result}`)
    } catch (error) {
      req.error('error', `Ocurrio un error: ${error}`)
  
      return h.view('ask', {
        title: 'Crear pregunta',
        error: 'Problemas creando la pregunta'
      }).code(500).takeover()
    }
  
    return h.redirect(`/question/${result}`)
  }

async function answerQuestion(req, h) {
    if(!req.state.user) {
      return h.redirect("/login")
    }

    let result
    try {
        result = await questions.answer(req.payload, req.state.user)
        console.log(`Respuesta creada con el id: ${result}`)
    } catch (error) {
        console.error(error)
    }
    return h.redirect(`/question/${req.payload.id}`) // redireccionamos a la vista de la pregunta respondida
}

async function setAnswerRight (req, h) {
  if(!req.state.user) {
    return h.redirect("/login")
  }

  let result;
  try {
    result =
    await req
    .server
    .methods
    .setAnswerRight(req.params.questionId, req.params.answerId, req.state.user)
    console.log(result)
  } catch (error) {
    console.error(error)
  }
  return h.redirect(`/question/${req.params.questionId}`)
}

module.exports = {
    createQuestion: createQuestion,
    answerQuestion: answerQuestion,
    setAnswerRight: setAnswerRight
}