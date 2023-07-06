const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

CategorySchema.methods.toJSON = function() {
  const category = this;
  const categoryObject = category.toObject();

  const { __v, _id, status, ...restoPropiedades } = categoryObject;
  restoPropiedades.uid = _id;
  return restoPropiedades;
}

module.exports = model('Category', CategorySchema);