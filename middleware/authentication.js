const jwt = require('jsonwebtoken');


exports.verifyuser = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
if (!token) {
    return res.status(401).send("User not logged In");
  }
  try {
   const decoded = jwt.verify(token,  "zyxwvut");  

   req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).send(err);
  }
};




