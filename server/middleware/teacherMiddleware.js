const jwt = require('jsonwebtoken');
const Admin = require("../models/admin");

const adminMiddleware = async(req, res, next) => {

  try {

      const token = req.cookies.token;
     
      if (!token) {
      throw new Error("token missing")
      }
      
      const payload = jwt.verify(token, process.env.JWT_KEY);

      const{id}=payload;
      if(!id){
          throw new Error("Id is missing");
      }

      const admin = await Admin.findById(id);

      if (!admin) {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
      req.user=payload;
      next();
  } catch (err) {
    res.status(400).json({ message: " Invalid or Expired Token1" });
  }
};


module.exports={adminMiddleware};