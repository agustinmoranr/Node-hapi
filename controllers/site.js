'use strict'

const { questions } = require('../models/index');

async function home(req, h) { //h es un objeto que nos ayuda a modificar la respuesta al cliente
    let data;
    try {
        data = await questions.getLast(10);
    } catch (error) {
        console.error(error)
    }
    return h.view('index', { // h.view sirve una vista 
        title: "Home", // valor de nuestra variable de handlebars
        user: req.state.user,
        questions: data
    }) 
 }

function register (req, h) { 
    if(req.state.user) {
        return h.redirect('/')
    }

    return h.view('register', { 
        title: "Registro", 
        user: req.state.user
    }) 
 } 

function login (req, h) {
    if(req.state.user) { // verificamos que el usuario no este logged 
        return h.redirect('/') // en caso de que lo este, retornamos al home
    }                         // ya que un usuario no debe poder logearse 2 veces

    return h.view('login', {
        title: "Ingresar",
        user: req.state.user // añadimos el valor de user en caso de que las vistas lo requieran
    })
}

function notFound (req, h) {
    return h.view('404', {}, { layout: 'error-layout' }).code(404);
    // view.(vista a renderizar, parámetros, objeto que nos permite cambiar propiedades de vision) 
}

function fileNotFound(req, h) {
    const response = req.response; // obtenemos el response
    //interceptamos el error. Si es de boom y si tiene un status 404
    if(response.isBoom && response.output.statusCode === 404){
        return h.view('404', {}, { layout: 'error-layout' }).code(404);
    }
    return h.continue // .continue continua el life cicle del request, en caso de que la
                    // validación anterior no ocurra
}

function ask (req, h) {
    if(!req.state.user) {
        return h.redirect('/login');
    }
    return h.view('ask', {
        title: 'Crear pregunta',
        user: req.state.user, // --> nuestra cookie
    })
}

 module.exports = {
     home: home,
     register: register,
     login: login,
     notFound: notFound,
     fileNotFound: fileNotFound,
     ask: ask,
 }