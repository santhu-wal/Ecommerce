const db = require("../connection");

exports.addCategory = async (req, res) => {
    try {
        if(req.user.role==="user") return res.send("Access Denied")
        const category = req.body.category;
        let foundCategory = await db('select * from category where category=?', category)
        if (foundCategory.length > 0) return res.send('category already exists.')
        await db('insert into category set category = ?', category)
        res.send('category added succesfully')

    } catch (e) {
        console.log(e.message)
    }
}

exports.addProduct = async (req, res) => {
    try {
        if(req.user.role==="user") return res.send("Access Denied")
        categoryId = req.params.categoryId
        productname = req.body.productname
        cost = req.body.cost
        var url;
        if (req.file) {
          url = req.file.destination + "/" + req.file.filename;
        }
    
        if(!categoryId) return res.send('categoryId is missing')
        let foundcategoryId=db('select * from category where id=?',categoryId)
        if(!foundcategoryId) return res.send('Invalid category')
        let foundProduct = await db('select * from products where productname=?', productname)
        if (foundProduct.length > 0) return res.send('product already exists.')
        await db('insert into products set ?',
            {
                productname,
                cost,
                categoryId,
                imagePath:url
            }
        )
        res.send('product added succesfully')
    } catch (e) {
        console.log(e.message)
    }
}

exports.deleteProduct=async(req,res)=>{
    try{
        if(req.user.role==="user") return res.send("Access Denied")
        let id=req.params.productId
        let product = await db('select * from products where id=?',id)
        if(product.length<1) return res.send('No product found. please enter valid product id.')
        await db('delete from products where id= ?',id)
        res.send('product deleted.')
    }catch(e){

    }
}

exports.editRole = async (req, res) => {
    try {
        if (req.user.role === "user") throw new Error("Access Denied")
        const id = req.params.id;
        let data = await db("select * from users where id=?", id)
        if (data.length < 1) throw new Error("id not found.")
        if (data[0].role === "user") {
            db("update users set role=? where id=?", ["admin", id])
            res.status(200).send("You made him admin")
        }
        if (data[0].role === "admin") {
            db("update users set role=? where id=?", ["user", id])
            res.status(200).send("Removed as admin")
        }
    }
    catch (err) {
        return res.send(err.message);
    }
}
