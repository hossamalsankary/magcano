const { StatusCodes } = require("http-status-codes");

class Responding{

// For Expectations  and User Singe Up
     succeedRes({data,token , message , statusCode = StatusCodes.CREATED}){
         
        return {
            status:true,
            code:statusCode,
            massage:message,
            data:data,
            token:token
        };
    }

    UnsuccessRes({data,token , message , statusCode = StatusCodes.BAD_REQUEST}){
        return {
            status:"succeed",
            code:statusCode,
            massage:message,
            data:data,
            token:token
        };
    }
}

module.exports = new  Responding();