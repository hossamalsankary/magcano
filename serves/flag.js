const path = require('path');
require('dotenv').config({ path: "../.env" });
module.exports =  getFlagPath = (teamName)=>{
    console.log(process.env.HOST_NAME);
 return path.join(String(process.env.HOST_NAME) , `${teamName}.png`);
};

