const db = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require('../lib/mailer')

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const role = "user";
        let user = await db("select * from users where email = ?", email)
        if (user.length > 0) throw new Error("you are already registered. please login")
        const encryptedPassword = await bcrypt.hash(password, 10);
        await db("insert into users set ?",
            {
                username,
                email,
                password: encryptedPassword,
                role
            }
        )
        mailer(username, email)
        return res.status(201).send("Registration succesfull");
    } catch (err) {
        return res.send(err.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await db("select * from users where email = ?", email)
        if (user.length < 1) throw new Error("You are not registered.")
        if (!(await bcrypt.compare(password, user[0].password))) {
            return res.status(401).send("password is incorrect");
        }
        const token = jwt.sign(
            {
                id: user[0].id,
                email: user[0].email,
                role: user[0].role
            },
            "zyxwvut",
            {
                expiresIn: "7d",
            }
        );
        res.status(200).json({ message: "login successful", token: token });
    } catch (err) {
        return res.send(err.message);
    }
};


exports.changePassword = async (req, res) => {
    try {
        const id = req.user.id;
        const { password, newpassword } = req.body;
        let result = await db("select * from users where id = ?", id)
        if (!(await bcrypt.compare(password, result[0].password))) {
            return res.status(400).send("password is incorrect");
        }
        const encryptedPassword = await bcrypt.hash(newpassword, 10);
        await db("update users set password=? where id=?", [encryptedPassword, id]);
        res.status(200).json({ success: true, message: "password changed succesfully" });
    }
    catch (err) {
        return res.status(500).send(err);
    }
}

// check this
exports.getinfo = async (req, res) => {
    try {
        if (req.user.role == 'admin') {
            let result = await db("SELECT U.id, U.username, U.emailId, (SELECT COUNT(*) FROM notes  WHERE notes.userId = U.id) AS notesCount FROM users U ");
            res.status(200).send(result)
        } else {
            const id = req.user.id;
            var sql = "SELECT id, username, emailId, (SELECT COUNT(*) FROM notes  WHERE notes.userId = users.id) AS notesCount FROM users  WHERE id =?";
            const result2 = await db(sql, id);
            res.status(200).send(result2);
        }
    } catch (err) {
        res.send(err.message);
    }
}


exports.deleteAcc = async (req, res) => {
    try {
        const id = req.user.id;
        let result = await db("select * from users where role=?", "admin")
        if (result.length < 2) throw new Error("Please make someone as admin to delete account")
        await db("delete from users where id=?", [id])
        res.status(200).send("user deleted")
    }
    catch (err) {
        return res.send(err.message);
    }
}




exports.getCategories= async (req,res)=>{
    try{
        let temp=await db('select C.category, (select COUNT(*) from products where products.categoryId=C.id) As total_number_of_items from category C ')
        res.send(temp)
    }catch(e){
        res.send(e.message)
    }
}



exports.getProducts=async (req,res)=>{
    try{
        let result = await db('select productname,cost from products')
        res.send(result)
    }catch(e){
        res.send(e.message)
    }
}


exports.getProductsByCategory=async (req,res)=>{
    try{
        let id=req.params.categoryId
        let result=await db('select products.productname, products.cost from products where products.categoryId=?',id)
        if(result.length<1) return res.send('No Items found under this category')
        res.send(result)
    }catch(e){
        res.send(e.message)
    }
}



exports.addProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.productId
        let product = await db('select productname, cost from products where id=?', id)
        if(product.length < 1) return res.send('No products found with the given id')
        await db('insert into cart set ?',
            {
                userId,
                productId: id
            }
        )
        res.send('product added to cart')
    } catch (e) {
        console.log(e.message)
    }
}

exports.removeProduct = async (req,res) => {
    try{
        let id=req.user.id
        let productId=req.params.productId
        if(!productId) return res.send('Product id is missing')
        let product = await db('select * from cart where productId=?',productId)
        if(product.length<1) return res.send('Cannot find product in your cart')
        await db('delete from cart where productId = ? AND userId = ?',[productId,id])
        res.send('product deleted from the cart')
    }catch(e){
        console.log(e.message)
    }
}

exports.getCart=async (req,res)=>{
    try{
        let id=req.user.id;
        let result = await db('select P.productname, P.cost from products P INNER JOIN cart ON P.id=cart.productId where cart.userId=?',id)
        if(result.length < 1) return res.send('No items added to the cart')
        res.send(result)
    }catch(e){
        console.log(e.message)
    }
}

