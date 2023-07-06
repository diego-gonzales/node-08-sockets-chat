const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
  imageURL: {
    type: String,
    default: null,
  },
});

ProductSchema.methods.toJSON = function () {
  const product = this;
  const productObject = product.toObject();

  const { __v, _id, status, ...restoPropiedades } = productObject;
  restoPropiedades.uid = _id;
  return restoPropiedades;
};

module.exports = model('Product', ProductSchema);
