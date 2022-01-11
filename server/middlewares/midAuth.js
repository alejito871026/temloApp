const jwt = require('jsonwebtoken');
const config = {
  authSecret:process.env.SECRET_KEY_TOKEN, // secret for generating jwt token
}
const isAuthenticated = function (req, res, next) {
  var token = req.headers.authorization
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token.replace(/^Bearer\s/, ''), config.authSecret,(err, decoded)=>{
      if (err) {
        return res.status(402).json({
          success: false,
          message: 'unauthorized',
          status:205
        })
      }
      if(decoded) {
        next();
      }
    });
  }else{
    return res.status(403).json({
      success: false,
      message: 'unauthorized',
      status:205
    })
  }
}
module.exports = isAuthenticated