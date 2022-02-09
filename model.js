const db = require("./connection");
const bcrypt=require('bcrypt')

let tables = async (req, res) => {
    try {
        await db(
            "create table if not exists users(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, username varchar(255), email varchar(255) NOT NULL, password varchar(255),role varchar(8), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
        );

        const email = "santhoshtedla@gmail.com";
        const password = await bcrypt.hash("santhosh111", 10);
        let results = await db("select * from users where email = ?", email)
        if (results.length < 1) {
            await db("insert into users set ?",
                {
                    username: "santhu",
                    email: email,
                    password: password,
                    role: "admin",
                }
            )
        }

        await db(
            "create table if not exists category(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,category varchar(255))",
        );

        await db(
            "create table if not exists products(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, productname varchar(255), cost varchar(10), categoryId int, FOREIGN KEY (categoryId)  REFERENCES category(id) ON DELETE CASCADE)"
        );
        await db(
            "create table if not exists cart(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, userId INT,productId INT,FOREIGN KEY (userId)  REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (productId)  REFERENCES products(id) ON DELETE CASCADE)"
        )
    }
    catch (error) {
        console.log(error)
    }
}
tables();



