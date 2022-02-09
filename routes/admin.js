const { request } = require("express");
const express = require("express");
const router = express.Router();

const adminController = require('../controllers/admin')
const authenticate=require('../middleware/authentication')
const upload = require('../middleware/multer')

//add category
router.post("/category",authenticate.verifyuser,  adminController.addCategory);

//add product under category
router.post("/:categoryId",upload.single('image') , authenticate.verifyuser, adminController.addProduct);

//to delete product
router.delete("/:productId", authenticate.verifyuser , adminController.deleteProduct)

//to change role user/admin
router.put("/:id", authenticate.verifyuser,  adminController.editRole)


module.exports=router