require('dotenv').config();
const jwt=require('jsonwebtoken');
function getToken(obj){
    return jwt.sign({obj},process.env.SCRECRET);
}
function checkToken(token){
    try{
        let decode=jwt.verify(token,process.env.SCRECRET);
        return decode;
    }catch(err){
        console.log("ERROR in JWT verification : ",err);
        return err;
    }
}
module.exports={getToken,checkToken}