'use strict'
// En este archivo desarrollamos el modelo de usuarios y el 
// sistema de encriptación de su contraseña


const bcrypt = require('bcrypt');

class User {
    constructor (db) { //recibe la base de datos ya inicializada
        this.db = db;
        this.ref = this.db.ref('/'); // referenciamos la raíz de la base de datos
        this.collection = this.ref.child('users'); // creamos el hijo users en la raíz de la colección
    }

    async create(data) { // metodo para almacenar un usuario en firebase 
        console.log(data)

        const user = { //destructuramos el objeto la data del objeto user (payload)
            ...data 
        }
        
        user.password = await this.constructor.encrypt(user.password) 
        const newUser = this.collection.push(user); // creamos nuevas referencias dentro de la collecion 
        return newUser.key; // devolvemos la ref del objeto creado (el id del usuario)
    } 
    
    static async encrypt (passwd) { //vamos a encriptar el password
        const saltRounds = 10; // veces que se ejecutara el algoritmo de encriptado
        const hashedPassword = await bcrypt.hash(passwd, saltRounds); //passwd encrypted
        return hashedPassword;
    }
}

module.exports = User