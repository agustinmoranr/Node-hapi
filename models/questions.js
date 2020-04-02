'use strict'

class Questions {
    constructor(db) { // recibe la instancia de firebase (la base de datos)
        this.db = db;
        this.ref = this.db.ref('/'); // creamos una referencia a la raíz
        this.collection = this.ref.child('questions'); // creamos la colección de questions
    }

    async create(data, user) {

        const ask = {
            ...data
        }
        console.log(ask) 

        ask.owner = user; // agregamos el usuario que viene en la cookie
        console.log(ask.owner)
        const question = this.collection.push() // creamos una nueva referencia
        question.set(ask);

        return question.key; // retornamos el key, id de firebase
    }

    async getLast(amount) {
        const query = await this.collection.limitToLast(amount).once('value');
        const data = query.val();
        return data;
    }

    async getOne(id) {
        const query = await this.collection.child(id).once('value');
        const data = query.val();
        return data;
    }
}

module.exports = Questions;