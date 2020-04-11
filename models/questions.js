'use strict'

class Questions {
    constructor(db) { // recibe la instancia de firebase (la base de datos)
        this.db = db;
        this.ref = this.db.ref('/'); // creamos una referencia a la raíz
        this.collection = this.ref.child('questions'); // creamos la colección de questions
    }

    async create(info, user, filename) {
        const data = {
            description: info.description,
            title: info.title,
            owner: user
        }

        if(filename) {
            data.filename = filename // guardamos el nombre del archivo
        }
        // const ask = {
        //     ...data
        // }
        // console.log(ask) 

        data.owner = user; 
        const question = this.collection.push() 
        question.set(data);

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

      async setAnswerRight (questionId, answerId, user)  {
        const query = await this.collection.child(questionId).once('value')
        const question = query.val()
        const answers = question.answers

        if(!user.email === question.owner.email) {
            return false
        }

        for (let key in answers) {
            answers[key].correct = (key === answerId)
        }

        const update = await 
            this.collection
            .child(questionId)
            .child('answers')
            .update(answers)
            return update;
      }
}

module.exports = Questions;