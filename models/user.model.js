const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  imageURL: {
    type: String,
    default: null // Se coloca un valor por defecto para que se muestre en el JSON de respuesta, de lo contrario no se mostraría
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    default: 'USER'
    // This is not necessary because we are using the Role model to validate the role
    // enum: ['USER', 'ADMIN']
  },
  status: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  // delete userObject.password;
  // delete userObject.__v;

  // userObject.uid = userObject._id;
  // delete userObject._id;

  // return userObject;

  const { __v, password, _id, ...restoDePropiedades } = userObject;
  restoDePropiedades.uid = _id;
  return restoDePropiedades;
}

module.exports = model('User', UserSchema);