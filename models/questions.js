'use strict'

class Questions {
    constructor(db) { // recibe la instancia de firebase (la base de datos)
        this.db = db;
        this.ref = this.db.ref('/'); // creamos una referencia a la raíz
        this.collection = this.ref.child('questions'); // creamos la colección de questions
    }

    async create(data, user) {
        data.owner = user; // agregamos el usuario que viene en la cookie
        const question = this.collection.push() // creamos una nueva referencia
        question.set(data);

        return question.key; // retornamos el key, id de firebase
    }
}

module.exports = Questions;