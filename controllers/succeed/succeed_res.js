const { StatusCodes } = require("http-status-codes");
const { model } = require("mongoose");

class SucceedRegister {
  constructor({ massage, token, data }) {
    data.password = undefined;
    this.massage = massage;
    this.token = token;
    this.data = data;

    console.log(massage);
  }

  get succeedCrateUser() {
    return {
      status: "succeed",
      massage: this.massage,
      Userdata: this.data,
      token: this.token,
    };
  }
  get succeedLogin() {
    return {
      status: "succeed",
      massage: this.massage,
      Userdata: this.data,
      token: this.token,
    };
  }
}
class SucceedAccess {
  constructor({ massage, token, data }) {
    this.massage = this.massage;
    this.token = token;
    this.data = data;
    console.log(massage);
  }

  accessToDataSucceed() {
    return {
      status: "succeed",
      statuscode: StatusCodes.OK,
      massage: this.massage,
      token: token,
      Userdata: data,
    };
  }
}
class HandelRspondes {
  constructor({ massage, token, data }) {
    this.massage = massage;
    this.token = token;
    this.data = data;

    console.log("expections Added");
  }
get succedCreateExpections(){
  return {
    status:true,
    massage:this.massage

  };
}
get unsuccedCreateExpections(){
  return {
    status:false,
    massage:this.massage

  };
}
}
module.exports = {
  SucceedRegister,
  SucceedAccess,
  HandelRspondes
};
