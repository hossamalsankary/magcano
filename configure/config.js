
const config = {
    VERSION:1,
    BULID:1,
    url:"http//127.0.0.1",
    PORT:process.env.PORT || 3000,
    API_PATH:"/api/v1/magicano",
   JWT_SECRET:process.env.JWT_SECRET,
   DATABASE_URL:process.env.DATABASE_URL,
    FAPi_URL:{
        event:"https://fantasy.premierleague.com/api/bootstrap-static/",
        match(gameId){
          return `https://fantasy.premierleague.com/api/fixtures/?event=${gameId}`;
        },
      },
    DB:{
        //MongoDB Configuretions
        HOST:"mongodb://localhost",
        PORT:27017,
        NAME:"magicano"
    },

    //Get Connections String For MongoDB
    getDBString (){
        return `${this.DB.HOST}:${this.DB.PORT}/${this.DB.NAME}`;
    },

    //Get Server Url String
    getSereverUrl(){
        return `${this.url}/${this.PORT}`;
    },

    //Get Api Magicano Url String 
    getMagicanoUrl (){
        return `${this.getDBString()}${this.API_PATH}`;
    }
};

module.exports = config;