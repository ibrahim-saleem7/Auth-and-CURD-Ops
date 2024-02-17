const validation = require("../middlewares/validation");
const Item = require("../validations/item.validation");
const ItemController = require("../controllers/item.controller");
const express = require("express");
const Token = require("../middlewares/verifyToken");
const fileUpload = require("../utils/fileUpload");



const router = express.Router();

router
  .route("/")
  .get(  ItemController.getAllItems)  // Token.authAdmin(['all']) ,
  .post(fileUpload('image'),validation(Item.addItem),ItemController.addItem);

router
.get('/:id', ItemController.getItemById )
.delete('/:id',ItemController.deleteItem )
.put('/:id',fileUpload('image'), validation(Item.updateItem), ItemController.updateItem);

module.exports = router;