import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  passwordHash: String,
  characters: {
    type: Array
    // type: mongoose.Schema.Types.ObjectId
    // ref: esquema donde se hara la referencia
  }
})

userSchema.plugin(uniqueValidator)// unique validator use

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

export const User = mongoose.model('User', userSchema)

/*
//Como buscar todos los datos en la base de datos
User.find({}).then(res =>{
  console.log(res);
  mongoose.connection.close()
})
*/

/*
  //como crear un nuevo usuario
  const user = new User({
    name: nameUser
  })

  //como guardar el ususario en la base de datos
  user.save()
  .then(result =>{
    console.log(result);
    mongoose.connection.close()
  }).catch(err =>{
    console.err('hubo un error al guardar los datos', err);
  })  */
