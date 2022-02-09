const express = require("express");
const router = express.Router();

const userController = require('../controllers/user')
const authenticate=require('../middleware/authentication')


//login route for customer
router.post("/login",  userController.login);

//adding customer register request
router.post("/register",  userController.signup);

//to change password
router.put("/changepassword", authenticate.verifyuser,  userController.changePassword)

//get all categories
router.get("/categories", authenticate.verifyuser, userController.getCategories)

//get all products 
router.get("/", authenticate.verifyuser , userController.getProducts)

//to get products for entered category
router.get("/products/:categoryId", authenticate.verifyuser , userController.getProductsByCategory)

//add product to cart
router.post('/:productId',authenticate.verifyuser, userController.addProduct)

//get items in cart
router.get('/cart', authenticate.verifyuser , userController.getCart)

//delete product from the cart
router.delete('/:productId',authenticate.verifyuser,userController.removeProduct)



module.exports=router