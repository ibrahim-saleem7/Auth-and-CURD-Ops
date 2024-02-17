const waitingListModel = require("../models/item.model.js");
const _ = require("lodash");
const AppError = require("../utils/appError.js")
const catchAsyncError = require("../middlewares/catchError.js")
const itemModel = require("../models/item.model");
const fs = require("fs");
const path = require("path");



class ItemController {
  /**
   * @description Get All item
   * @route /api/item
   * @method GET
   * @access public
   */
  static getAllItems = catchAsyncError(async function(req, res, next) {

    const pageSize = req.query.pageSize || 20
    const pageNumber = req.query.pageNumber || 1

      const items = await itemModel.find({})
        .skip((pageNumber -1 ) * pageSize)
        .limit(pageSize)

      if(!items) return next(new AppError("not found items", 404))

      const results = await itemModel.find().count()
      const pagesTotal  = results>pageSize? (results/pageSize) : 1

      return res.status(200).json({
        status: 'success',
        data: {
        results,
        requestResults: items.length,
        pageNumber,
        pageSize,
        pagesTotal ,
        items,
        }
      });

  })


  /**
   * @description get item by id
   * @route /api/item/:id
   * @method GET
   * @access public
   */
  static getItemById = catchAsyncError(async function(req, res, next) {

      const itemId = req.params.id
      if (!itemId) return next(new AppError("Missing itemId", 400))

      const item = await itemModel.findById(itemId)
      if(!item) return next(new AppError(" item not found", 404))

      return res.status(200).json({
        status: 'success',
        data: {
            item
        }
      });

  })

  /**
   * @description Delete item
   * @route /api/item/:id
   * @method DELETE
   * @access public // if private change handling route to auth user 
   */
  static deleteItem= catchAsyncError(async function(req, res, next) {

      const itemId = req.params.id
      if (!itemId) return next(new AppError("Missing itemId", 400))

      const item = await itemModel.findByIdAndDelete(itemId)
      if(!item) return next(new AppError(" item not found", 404))


      return res.status(200).json({
        status: 'success',
        data: {
            item
        },
        message : `item detected successfully`
      });

  })

  /**
   * @description Add a new item
   * @route /api/item
   * @method POST
   * @access public
   */
  static addItem = catchAsyncError(async function(req, res, next) {
    
      const body = _.pick(req.body, ["name","owner","address","image"]);
      if (!body) return next(new AppError("Missing required data", 400))

      const existingItem= await itemModel.findOne({name: body.name, owner: body.owner});
      if (existingItem) return next(new AppError("Item with the same Name and owner already exists", 409))

      const image = req.files?.image
      if(image) {
        body.image = await image[0].filename
      }

      const item = await itemModel.create(body);

      return res.status(200).json({
        status: 'success',
        data: {
            item
        },
        message: `${item.name} created successfully`
      });

  })

  /**
 * @description update item
 * @route /api/item/:id
 * @method PUT
 * @access Private
 */
  static updateItem = catchAsyncError(async function(req, res, next) {

      const itemId  = req.params.id;
      if (!itemId) return next(new AppError("item Id Missing", 400))

      const body = _.pick(req.body, ["name", "owner" ,"address","image"]);
      if (!body) return next(new AppError("Missing required data", 400))

      const item = await itemModel.findById(itemId);
      if (!item) return next(new AppError("item not found", 404))

      const image = req.files?.image

        if(image){
          if(fs.existsSync(path.join(__dirname, `../../uploads/${item.image}`))){
            fs.unlinkSync(path.join(__dirname, `../../uploads/${item.image}`))
          }
          body.image = await image[0].filename
        }

        Object.assign(item, body);
        const updatedItem = await item.save();

      return res.status(200).json({
        status: 'success',
        data: {
            item: updatedItem
        },
        message: `Updated ${updatedItem.name} successfully`
      });
  })


}

module.exports = ItemController;
