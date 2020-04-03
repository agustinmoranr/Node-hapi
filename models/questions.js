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

        ask.owner = user; 
        console.log(ask.owner)
        const question = this.collection.push() 
        question.set(ask);

        return question.key; 
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

    // Modelo para insertar una respuesta
    async answer (data, user) {
        const answers = await 
            this.collection 
            .child(data.id) // recogemos el id de la pregunta (data proviene del payload)
            .child('answers') // dentro de cada pregunta generamos un nuevo arreglo de answers (cada pregunta tiene sus respuestas)
            .push() // hacemos una inserción de la data
        answers.set({
            text: data.answer,  // agregamos la respuesta y el usuario como método
            user: user // para poder aplicarlo en el index.hbs
        })
        return answers
      }
}

module.exports = Questions;