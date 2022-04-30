const path = require('path');
require('dotenv').config({ path: "../.env" });
module.exports =  getFlagPath = (teamName)=>{
 return path.join(String(process.env.HOST_NAME) , `${teamName}.png`);
};

