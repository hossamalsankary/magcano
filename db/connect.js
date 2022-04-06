const mongoose = require('mongoose');

const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }).then(()=>{
    console.log("connectd");
  });
};
const endconections = ()=>{
 return mongoose.disconnect();
};


module.exports = {connectDB , endconections};
