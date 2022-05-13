const path = require('path');
require('dotenv').config({ path: "../.env" });
module.exports =  getFlagPath = (teamName)=>{
    console.log(process.env.HOST_NAME);
 let pathImg =  path.join(String(process.env.HOST_NAME) , `${teamName}.png`);
 if(pathImg == undefined){
     pathImg = "https://ouch-cdn2.icons8.com/V0BC7efDTAkp2JZ9DUHT5wrH5rCdoAkMGizUQs1w0lE/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNjAx/L2JhMjNmNDlhLTZm/NjctNDI2Yi05NGQx/LWNmZjBjNmFkMTJh/OS5zdmc.png";
 }
return pathImg;
};

