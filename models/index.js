'use strict'

// En este archivo esta el modelo de la configuración de
// firebase y su conexión con nuestro proyecto

const firebase = require('firebase-admin'); 
const serviceAccount = require('../config/firebase.json') // importamos las credenciales

firebase.initializeApp({ //inicializamos la base de datos
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://platzioverflow-3cde8.firebaseio.com"
})

const db = firebase.database() // creamos una instancia y la conexión con la base de datos
const User = require('./users'); // importamos el modulo de usuarios

module.exports = {
    users: new User(db) // cada vez que se importe el modelo, tendremos una
}   // sola instancia de la referencia de usuarios de firebase 