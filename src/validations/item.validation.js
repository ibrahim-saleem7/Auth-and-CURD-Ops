const joi = require("joi");

class Item {
  static addItem = joi.object({
    name: joi.string().required(),
    phone: joi.string().required(),
    address: joi.string().required(),
    image: joi.string(),
  });

  static updateItem = joi.object({
    name: joi.string(),
    phone: joi.string(),
    address: joi.string(),
    image: joi.string(),
  });
}

module.exports = Item;
