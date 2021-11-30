import mongoose from 'mongoose'
const connectionString = process.env.MONGO_DB_URI

// conexion a la mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error('hubo un error', err)
  })

// cerrar el servidor cuando haya un error
process.on('uncaughtException', error => {
  console.error(error)
  mongoose.disconnect()
})
