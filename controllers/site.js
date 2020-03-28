'use strict'

function home(req, h) { //h es un objeto que nos ayuda a modificar la respuesta al cliente
    return h.view('index', { // h.view sirve una vista 
        title: "Home", // valor de nuestra variable de handlebars
    }) 
 }

function register (req, h) { 
    return h.view('register', { 
        title: "Registro", 
    }) 
 } 

 module.exports = {
     home: home,
     register: register,
 }